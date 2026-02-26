import Form from "react-bootstrap/Form";
import SCHEMAS from "../GetCatalogModelPage";

/* General Step Forms */
import ListComponent from "../Components/ListComponent";
import KeyValueDictComponent from "../Components/KeyValueDictComponent";
import { Key } from "lucide-react";

const ConfigSectionIFAC = ({ control, register, errors, watch, setValue, storedData}) => {
  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Tool Configuration Info</span>
      </Form.Label>

      <div className="mb-4">
        <ListComponent
          name="Example Config"
          description="Add links to example configuration files or documents"
          fieldName="config.example_configs"
          required={false}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          storedData={storedData}
        />
        <ListComponent
          name="Tool Mode"
          description="Add tool modes (e.g. 'single run', 'sensitivity analysis', 'uncertainty quantification')"
          fieldName="config.model_modes"
          required={false}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          storedData={storedData}
        />
        <KeyValueDictComponent
          name="Tool Option"
          description="Add tool options (e.g. 'option name': 'option values or description')"
          fieldName="config.model_options"
          control={control}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          storedData={storedData}
        />
        <ListComponent
          name="Technologies"
          description="Add technologies represented in the model (e.g. 'solar', 'wind', 'nuclear')"
          fieldName="config.technologies"
          required={false}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          storedData={storedData}
        />
      </div>
    </div>
  );
}


export default ConfigSectionIFAC;
