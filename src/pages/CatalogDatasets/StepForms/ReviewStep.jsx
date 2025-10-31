import Badge from 'react-bootstrap/Badge';
import { useFormContext } from 'react-hook-form';

const ReviewStep = () => {
  const { watch } = useFormContext();
  const formData = watch();

  const Section = ({ title, children }) => (
    <div className="review-section mb-4">
      <h5 className="review-section-title">{title}</h5>
      <div className="review-content">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value }) => (
    <div className="review-item">
      <div className="review-label">{label}:</div>
      <div className="review-value">
        {value || <em>Not specified</em>}
      </div>
    </div>
  );

  const ArrayField = ({ label, values }) => (
    <div className="review-item">
      <div className="review-label">{label}:</div>
      <div className="review-value">
        {values && values.length > 0 ? (
          <div className="d-flex flex-wrap gap-1 mt-1">
            {values.map((val, idx) => (
              <Badge key={idx} bg="secondary">{val}</Badge>
            ))}
          </div>
        ) : (
          <em>Not specified</em>
        )}
      </div>
    </div>
  );

  return (
    <div className="text-start">
      <h4 className="step-title">Review Dataset Information</h4>
      <p className="text-muted mb-4">
        Please review all information before creating the dataset
      </p>

      <Section title="Basic Information">
        <Field label="Name" value={formData.name} />
        <Field label="Display Name" value={formData.display_name} />
        <Field label="Description" value={formData.description} />
      </Section>

      <Section title="Location">
        <Field label="System Type" value={formData.location?.system_type} />
        <Field label="Storage Path" value={formData.location?.storage_path} />
        <Field label="Access Info" value={formData.location?.access_info} />
        <Field label="Extra Note" value={formData.location?.extra_note} />
      </Section>

      <Section title="Version & Format">
        <Field label="Version" value={formData.version} />
        <Field label="Previous Version" value={formData.previous_version} />
        <Field label="Hash Value" value={formData.hash_value} />
        <Field label="Data Format" value={formData.data_format} />
        <Field label="Resource URL" value={formData.resource_url} />
      </Section>

      <Section title="Metadata">
        <ArrayField label="Units" values={formData.units} />
        <ArrayField label="Relevant Links" values={formData.relevant_links} />
      </Section>

      <Section title="Temporal Information">
        <ArrayField label="Weather Years" values={formData.weather_years} />
        <ArrayField label="Model Years" values={formData.model_years} />
        <Field label="Start Date" value={formData.temporal_info?.start_date} />
        <Field label="End Date" value={formData.temporal_info?.end_date} />
        <Field label="Resolution" value={formData.temporal_info?.resolution} />
      </Section>

      <Section title="Spatial Information">
        <Field label="Extent" value={formData.spatial_info?.extent} />
        <Field label="Resolution" value={formData.spatial_info?.resolution} />
        <Field label="Coordinate System" value={formData.spatial_info?.coordinate_system} />
      </Section>

      <Section title="Scenarios & Sensitivities">
        <ArrayField label="Scenarios" values={formData.scenarios} />
        <ArrayField label="Sensitivities" values={formData.sensitivities} />
      </Section>

      <Section title="Source Code">
        <Field label="Repository" value={formData.source_code?.repository} />
        <Field label="Commit Hash" value={formData.source_code?.commit_hash} />
        <Field label="Branch" value={formData.source_code?.branch} />
        <Field label="Script Path" value={formData.source_code?.script_path} />
        <Field label="Version" value={formData.source_code?.version} />
        <Field label="Description" value={formData.source_code?.description} />
      </Section>
    </div>
  );
};

export default ReviewStep;
