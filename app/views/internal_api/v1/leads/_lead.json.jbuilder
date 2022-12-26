# frozen_string_literal: true

json.extract! lead, :id, :name, :budget_amount,
                    :industry_code, :quality_code,
                    :stage_code, :status_code,
                    :industry_code_name, :quality_code_name,
                    :stage_code_name, :status_code_name, :first_name,
                    :last_name, :title
