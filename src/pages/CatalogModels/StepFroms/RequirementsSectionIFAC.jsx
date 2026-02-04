
import { useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ListComponent from "../Components/ListComponent";

const RequirementsSectionDefaultsIFAC = {
    spatial: {name:"",extent: "", fidelity: "", scope:[""],misc:{} },
    temporal: {name:"",extent:"",resolution:"",years:[""],weather_years:[""],misc:{} },
    environment: {name:"",type:"environment",platform:"",resources:"",required_software:[""],licenses:[""],misc:{} },
    misc: {name:""}
  };
// RequirementsSection for model creation
const RequirementsSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  // Use storedData for initial state if present and not empty
  

  
  const initialRequirements = {
    spatial: Object.keys(storedData.requirements.spatial || {}).length > 0
      ? storedData.requirements.spatial
      : {},

    temporal: Object.keys(storedData.requirements.temporal || {}).length > 0
      ? storedData.requirements.temporal
      : {},

    environment: Object.keys(storedData.requirements.environment || {}).length > 0
      ? storedData.requirements.environment
      : {},
  
    misc: Object.keys(storedData.requirements.misc || {}).length > 0
    ? storedData.requirements.misc
    : RequirementsSectionDefaultsIFAC['misc']
  };

  const [requirements, setRequirements] = useState(initialRequirements);
  const [requirementIds, setRequirementIds] = useState({
    spatial:Object.keys(initialRequirements.spatial),
    temporal:Object.keys(initialRequirements.temporal),
    environment:Object.keys(initialRequirements.environment),
    misc:Object.keys(initialRequirements.misc)
  });

  // Prefill from zustand store if available when mounting or when storedData changes
  useEffect(() => {
    if (Object.keys(storedData.requirements || {}).length > 0) {
      setRequirements(storedData.requirements);
      setRequirementIds(Object.keys(storedData.requirements));
      setValue("requirements", storedData.requirements);
    }
  }, [storedData, setValue]);

  const addRequirement = (type) => {
    const timestamp = Date.now();
    const newId = `req_${timestamp}`;
    const newRequirements = {
      ...requirements,
      [type]:{
        ...requirements[type],
        [newId]: RequirementsSectionDefaultsIFAC[type]
      }
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
    //setRequirementIds({
    //  ...requirementIds, 
    //  [type]:[...requirementIds[type], newId]});
  };

  const removeRequirement = (type, id) => {
    const { [type]:{[id]: removed, ...rest }, ...other_types} = requirements;
    setRequirements({...other_types,[type]:{...rest}});
    setValue("requirements", {...other_types,[type]:{...rest}});
    //setRequirementIds(requirementIds.filter(reqId => reqId !== id));
  };

  const updateRequirementName = (type, id, newName) => {
    const newRequirements = {
      ...requirements,
      [type]:{
        ...requirements[type],
        [id]: {
        ...requirements[type][id],
        name: newName
      }}
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const updateRequirementValue = (type, id, key, value) => {
    const newRequirements = {
      ...requirements,
      [type]:{
        ...requirements[type],
        [id]: {
        ...requirements[type][id],
        [key]: value
      }}
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  /*const toggleRequirementType = (e,id) => {
    //const currentType = requirements[id]?.type;
    const newType = e.target.value;
    let newValue;
    if (newType === "spatial") {
      newValue = {"":{"extent":"","fidelity":"","scope":[""],"misc":{"":""}}};
    } else if (newType === "temporal") {
      newValue = {"":{"extent":"","resolution":"","years":[""],"weather_years":[""],"misc":{"":""}}};
    } else if (newType === "environment") {
      newValue = {"":{"platform":"","resources":"","required_software":[""],"licenses":[""],"misc":{"":""}}};
    } else {
      newValue = { "": "", "": "" };
    }
    const newRequirements = {
      ...requirements,
      [id]: {
        ...requirements[id],
        type: newType,
        value: newValue
      }
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };*/

  const addObjectField = (reqId) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    const updatedValue = {
      ...reqData.value,
      [""]: ""
    };
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const updateObjectFieldValue = (reqId, fieldKey, fieldValue) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    const updatedValue = {
      ...reqData.value,
      [fieldKey]: fieldValue
    };
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const updateObjectFieldKey = (reqId, oldKey, newKey) => {
    if (!newKey || oldKey === newKey) return;
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    if (Object.prototype.hasOwnProperty.call(reqData.value, newKey) && oldKey !== newKey) {
      return;
    }
    const updatedValue = {};
    Object.entries(reqData.value).forEach(([key, value]) => {
      if (key === oldKey) {
        updatedValue[newKey] = value;
      } else {
        updatedValue[key] = value;
      }
    });
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const removeObjectField = (reqId, fieldKey) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    const fieldKeys = Object.keys(reqData.value || {});
    if (fieldKeys.length <= 1) return;
    const updatedValue = {};
    Object.entries(reqData.value).forEach(([key, value]) => {
      if (key !== fieldKey) {
        updatedValue[key] = value;
      }
    });
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Requirements</span>
      </Form.Label>
      <div>
        <Form.Label className="form-field-label">
        <span className="form-field-text">Spatial Requirements</span>
        </Form.Label>
        <div key="spatial" className="mb-4 border p-3 rounded">
          {Object.keys(requirements["spatial"]).map((key,idx) => {
            const reqData = requirements['spatial'][key];
            if (!reqData) return null;
            return (
              <div key={key} className="mb-4 border p-3 rounded">
                <Form.Label className="small fw-bold">Requirement Name</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="Requirement"
                        value={reqData.name || ""}
                        onChange={(e) => updateRequirementName("spatial", key, e.target.value)}
                />
                <Form.Label className="small fw-bold">Extent</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="extent"
                        value={reqData.extent || ""}
                        onChange={(e) => updateRequirementValue("spatial", key, "extent", e.target.value)}
                />
                <Form.Label className="small fw-bold">Fidelity</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="fidelity"
                        value={reqData.fidelity || ""}
                        onChange={(e) => updateRequirementValue("spatial", key, "fidelity", e.target.value)}
                />
                <ListComponent
                  name="Scope"
                  description="Tool spatial scope."
                  fieldName={`requirements.spatial.${key}.scope`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
                
                {/*TODO Misc */}
                <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => removeRequirement('spatial',key)}
                      className="d-flex align-items-right justify-content-right"
                      style={{ width: "32px", height: "38px", padding: "4px" }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
          <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => addRequirement('spatial')}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Spatial Requirement
          </Button>
          </div>
      
        </div>
      </div>
      <div>
        <Form.Label className="form-field-label">
        <span className="form-field-text">Temporal Requirements</span>
        </Form.Label>
        <div key="temporal" className="mb-4 border p-3 rounded">
          {Object.keys(requirements["temporal"]).map((key,idx) => {
            const reqData = requirements['temporal'][key];
            if (!reqData) return null;
            return (
              <div key={key} className="mb-4 border p-3 rounded">
                <Form.Label className="small fw-bold">Requirement Name</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="Requirement"
                        value={reqData.name || ""}
                        onChange={(e) => updateRequirementName("temporal", key, e.target.value)}
                />
                <Form.Label className="small fw-bold">Extent</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="extent"
                        value={reqData.extent || ""}
                        onChange={(e) => updateRequirementValue("temporal", key, "extent", e.target.value)}
                />
                <Form.Label className="small fw-bold">Resolution</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="resolution"
                        value={reqData.resolution || ""}
                        onChange={(e) => updateRequirementValue("temporal", key, "resolution", e.target.value)}
                />
                <ListComponent
                  name="Year"
                  description="Tool study years."
                  fieldName={`requirements.temporal.${key}.years`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
                <ListComponent
                  name="Weather Year"
                  description="Tool weather years."
                  fieldName={`requirements.temporal.${key}.weather_years`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
                {/*TODO Misc */}
                <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => removeRequirement('temporal',key)}
                      className="d-flex align-items-right justify-content-right"
                      style={{ width: "32px", height: "38px", padding: "4px" }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
          <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => addRequirement('temporal')}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Temporal Requirement
          </Button>
          </div>
        </div>
      </div>
      <div>
        <Form.Label className="form-field-label">
        <span className="form-field-text">Environment Requirements</span>
        </Form.Label>
        <div key="temporal" className="mb-4 border p-3 rounded">
          {Object.keys(requirements["environment"]).map((key,idx) => {
            const reqData = requirements['environment'][key];
            if (!reqData) return null;
            return (
              <div key={key} className="mb-4 border p-3 rounded">
                <Form.Label className="small fw-bold">Requirement Name</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="Requirement"
                        value={reqData.name || ""}
                        onChange={(e) => updateRequirementName("environment", key, e.target.value)}
                />
                <Form.Label className="small fw-bold">Platform</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="platform"
                        value={reqData.platform || ""}
                        onChange={(e) => updateRequirementValue("environment", key, "platform", e.target.value)}
                />
                <Form.Label className="small fw-bold">Resources</Form.Label>
                <Form.Control
                        type="text"
                        className="form-control-lg form-primary-input"
                        placeholder="Resources"
                        value={reqData.resources || ""}
                        onChange={(e) => updateRequirementValue("environment", key, "resources", e.target.value)}
                />
                <ListComponent
                  name="Required Software"
                  description="List of required software for the tool."
                  fieldName={`requirements.environment.${key}.required_software`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
                <ListComponent
                  name="License"
                  description="Licenses required for the tool."
                  fieldName={`requirements.environment.${key}.licenses`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
                {/*TODO Misc */}
                <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => removeRequirement('environment',key)}
                      className="d-flex align-items-right justify-content-right"
                      style={{ width: "32px", height: "38px", padding: "4px" }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
          <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => addRequirement('environment')}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Environment Requirement
          </Button>
          </div>
      
        </div>
      </div>

    </div>

  );
};


export default RequirementsSectionIFAC;
