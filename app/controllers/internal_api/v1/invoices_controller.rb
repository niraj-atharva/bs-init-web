# frozen_string_literal: true

class InternalApi::V1::InvoicesController < InternalApi::V1::ApplicationController
  before_action :load_client, only: [:create, :update]
  after_action :ensure_time_entries_billed, only: [:send_invoice]

  def index
    authorize Invoice
    pagy, invoices = pagy(invoices_query, items_param: :per_page)

    recently_updated_invoices = current_company.invoices
      .includes(:client)
      .order("updated_at desc")
      .limit(10)

    render :index, locals: {
      invoices:,
      recently_updated_invoices:,
      pagy: pagy_metadata(pagy),
      summary: current_company.overdue_and_outstanding_and_draft_amount
    }
  end

  def create
    authorize Invoice
    render :create, locals: {
      invoice: current_company.invoices.create!(invoice_params),
      client: @client
    }
  end

  def edit
    authorize invoice
    render :edit, locals: { invoice: }
  end

  def update
    authorize invoice

    invoice.update!(invoice_params)
    render :update, locals: {
      invoice:,
      client: @client
    }
  end

  def show
    authorize invoice
    render :show, locals: {
      invoice:
    }
  end

  def destroy
    authorize invoice
    invoice.destroy
  end

  def send_invoice
    authorize invoice

    invoice.sending!
    invoice.send_to_email(
      subject: invoice_email_params[:subject],
      message: invoice_email_params[:message],
      recipients: invoice_email_params[:recipients]
    )

    render json: { message: "Invoice will be sent!" }, status: :accepted
  end

  def download
    authorize invoice

    send_data InvoicePayment::PdfGeneration.process(invoice, current_company.company_logo, root_url)
  end

  private

    def load_client
      client = invoice_params[:client_id] || invoice[:client_id]
      @client = Client.find(client)
    end

    def invoice
      @_invoice ||= Invoice.includes(:client, :invoice_line_items).find(params[:id])
    end

    def invoice_params
      params.require(:invoice).permit(
        policy(Invoice).permitted_attributes
      )
    end

    def invoice_email_params
      params.require(:invoice_email).permit(:subject, :message, recipients: [])
    end

    def ensure_time_entries_billed
      invoice.update_timesheet_entry_status!
    end

    def invoices_query
      @_invoices_query ||= current_company.invoices.includes(:client)
        .search(params[:query])
        .issue_date_range(from_to_date(params[:from_to]))
        .for_clients(params[:client_ids])
        .with_statuses(params[:statuses])
        .order(created_at: :desc)
    end

    def from_to_date(from_to)
      if from_to
        DateRangeService.new(timeframe: from_to[:date_range], from: from_to[:from], to: from_to[:to]).process
      end
    end
end
