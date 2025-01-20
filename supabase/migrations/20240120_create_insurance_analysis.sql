CREATE TABLE IF NOT EXISTS public.insurance_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient
        FOREIGN KEY(patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE public.insurance_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON public.insurance_analysis FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.insurance_analysis FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add index for better query performance
CREATE INDEX idx_insurance_analysis_patient_id 
ON insurance_analysis(patient_id);