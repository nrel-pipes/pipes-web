
import { useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ListComponent from "../Components/ListComponent";
import { Dropdown, Toggle} from "react-bootstrap";
import RequirementsSectionDefaultsIFAC from "./RequirementsSectionIFAC";

const SchemaInfoDefaultsIFAC = {
  format:"", fields:[""], misc:{"":""}
}

const InputsSectionDefaultsIFAC = {
    general_data_description: {type: "general_data_description", general_data_description:{name:"", description: "", priority: "", private: false, NDA: false,
      category:"", provider:"", units:"",tags:[""],years:[""],weather_years:[""],scenarios:[""],misc:{"":""},
      schema_info: SchemaInfoDefaultsIFAC, temporal_dimensions: {extent:"",resolution:"",years:[""],weather_years:[""],misc:{"":""} },
      spatial_dimensions: {extent: "", fidelity: "", scope:[""],misc:{"":""} }}},
    dataset: {type: "dataset", dataset: {name:"", description: "", author: "", date: "", version: "", location: "", priority: "",
      private: false, NDA: false, category:"", provider:"", units:"",tags:[""],years:[""],
      weather_years:[""],scenarios:[""],misc:{"":""},
      schema_info: SchemaInfoDefaultsIFAC, temporal_dimensions: {extent:"",resolution:"",years:[""],weather_years:[""],misc:{"":""} },
      spatial_dimensions: {extent: "", fidelity: "", scope:[""],misc:{"":""} }}},
    misc: {type: "misc",misc:{name:"","":""}}
  };
// InputsSection for model creation
const InputsSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  
  // Use storedData for initial state if present and not empty
  // Convert from list (in db) to dict to make UI actions easier to manage
  const initialInputs = (storedData.inputs || []).length > 0
    ? storedData.inputs.reduce((accumulator,currentValue) => {
      accumulator[currentValue['name']] = currentValue;
      return accumulator;
    }, {})
    : { input_default: InputsSectionDefaultsIFAC['general_data_description'] };

  const [inputs, setInputs] = useState(initialInputs);
  const [inputIds, setInputIds] = useState(Object.keys(initialInputs));

  // Prefill from zustand store if available when mounting or when storedData changes
  useEffect(() => {
    if (Object.keys(storedData.inputs || {}).length > 0) {
      setInputs(storedData.inputs);
      setInputIds(Object.keys(storedData.inputs));
      setValue("inputs", storedData.inputs);
    }
  }, [storedData, setValue]);

  const addInput = (type) => {
    const timestamp = Date.now();
    const newId = `input_${timestamp}`;
    const newInputs = {
      ...inputs,
      [newId]: InputsSectionDefaultsIFAC[type]
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
    setInputIds([...inputIds, newId]);
  };

  const removeInput = (id) => {
    const { [id]: removed, ...rest } = inputs;
    setInputs(rest);
    setValue("inputs", rest);
    setInputIds(inputIds.filter(inId => inId !== id));
  };

  const updateInputName = (type, id, newName) => {
    const newInputs = {
      ...inputs,
      [id]: {
        ...inputs[id],
        [type]: {
        ...inputs[id][type],
        name: newName
        }
      }
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const updateInputValue = (type, id, key, value) => {
    const newInputs = {
      ...inputs,
      [id]:{
        ...inputs[id],
        [type]: {
        ...inputs[id][type],
        [key]: value
      }}
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const updateInputValuelv2 = (type, id, key1, key2, value) => {
    const newInputs = {
      ...inputs,
      [id]:{
        ...inputs[id],
        [type]: {
        ...inputs[id][type],
        [key1]: {
          ...inputs[id][type][key1],
          [key2]: value
        }
      }}
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const toggleInputType = (id) => {
    const currentType = inputs[id]?.type;
    const newType = currentType === "string" ? "object" : "string";
    let newValue;
    if (newType === "string") {
      newValue = "";
    } else {
      newValue = { "": "", "": "" };
    }
    const newInputs = {
      ...inputs,
      [id]: {
        ...inputs[id],
        type: newType,
        value: newValue
      }
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const addObjectField = (inId) => {
    const inData = inputs[inId];
    if (!inData || inData.type !== "object") return;
    const updatedValue = {
      ...inData.value,
      [""]: ""
    };
    const updatedInput = {
      ...inData,
      value: updatedValue
    };
    const newInputs = {
      ...inputs,
      [inId]: updatedInput
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const updateObjectFieldValue = (inId, fieldKey, fieldValue) => {
    const inData = inputs[inId];
    if (!inData || inData.type !== "object") return;
    const updatedValue = {
      ...inData.value,
      [fieldKey]: fieldValue
    };
    const updatedInput = {
      ...inData,
      value: updatedValue
    };
    const newInputs = {
      ...inputs,
      [inId]: updatedInput
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const updateObjectFieldKey = (inId, oldKey, newKey) => {
    if (!newKey || oldKey === newKey) return;
    const inData = inputs[inId];
    if (!inData || inData.type !== "object") return;
    if (Object.prototype.hasOwnProperty.call(inData.value, newKey) && oldKey !== newKey) {
      return;
    }
    const updatedValue = {};
    Object.entries(inData.value).forEach(([key, value]) => {
      if (key === oldKey) {
        updatedValue[newKey] = value;
      } else {
        updatedValue[key] = value;
      }
    });
    const updatedInput = {
      ...inData,
      value: updatedValue
    };
    const newInputs = {
      ...inputs,
      [inId]: updatedInput
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  const removeObjectField = (inId, fieldKey) => {
    const inData = inputs[inId];
    if (!inData || inData.type !== "object") return;
    const fieldKeys = Object.keys(inData.value || {});
    if (fieldKeys.length <= 1) return;
    const updatedValue = {};
    Object.entries(inData.value).forEach(([key, value]) => {
      if (key !== fieldKey) {
        updatedValue[key] = value;
      }
    });
    const updatedInput = {
      ...inData,
      value: updatedValue
    };
    const newInputs = {
      ...inputs,
      [inId]: updatedInput
    };
    setInputs(newInputs);
    setValue("inputs", newInputs);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Inputs</span>
      </Form.Label>
      <div>
        {inputIds.map((id, idx) => {
          const type = inputs[id]['type'];
          const inData = inputs[id][type];
          if (!inData) return null;
          return (
            <div key={id} className="mb-4 border p-3 rounded">
              <Form.Label className="small fw-bold">Input Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Input"
                value={inData.name || ""}
                onChange={(e) => updateInputName(type, id, e.target.value)}
              />
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() => removeInput(id)}
                className="d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "38px", padding: "4px" }}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Form.Label className="small fw-bold">Description</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Description"
                value={inData.description || ""}
                onChange={(e) => updateInputValue(type, id, "description", e.target.value)}
              />
              <Form.Label className="small fw-bold">Category</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Category"
                value={inData.category || ""}
                onChange={(e) => updateInputValue(type, id, "category", e.target.value)}
              />
              {type === "dataset" ? (
                <div>
                <Form.Label className="small fw-bold">Author</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="Author"
                  value={inData.author || ""}
                  onChange={(e) => updateInputValue(type, id, "author", e.target.value)}
                />
                <Form.Label className="small fw-bold">Date</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="YYYY-MM-DD hh:mm:ss"
                  value={inData.date || ""}
                  onChange={(e) => updateInputValue(type, id, "date", e.target.value)}
                />
                <Form.Label className="small fw-bold">Version</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="Version"
                  value={inData.version || ""}
                  onChange={(e) => updateInputValue(type, id, "version", e.target.value)}
                />
                <Form.Label className="small fw-bold">Location</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="Location"
                  value={inData.location || ""}
                  onChange={(e) => updateInputValue(type, id, "location", e.target.value)}
                />
                </div>
              ):(<div></div>)}
              <Form.Label className="small fw-bold">Priority</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Priority"
                value={inData.priority || ""}
                onChange={(e) => updateInputValue(type, id, "priority", e.target.value)}
              />
              <Row>
                <Col>
                <Form.Label className="small fw-bold">Private</Form.Label>
                <Form.Check
                  type="switch"
                  defaultChecked={inData.private || false}
                  onChange={(e) => updateInputValue(type, id, "private", e.target.checked)}
                />
                </Col><Col>
                <Form.Label className="small fw-bold">NDA</Form.Label>
                <Form.Check
                  type="switch"
                  defaultChecked={inData.NDA || false}
                  onChange={(e) => updateInputValue(type, id, "NDA", e.target.checked)}
                />
                </Col>
              </Row>
              <Form.Label className="small fw-bold">Provider</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Provider"
                value={inData.provider || ""}
                onChange={(e) => updateInputValue(type, id, "provider", e.target.value)}
              />
              <Form.Label className="small fw-bold">Units</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Units"
                value={inData.units || ""}
                onChange={(e) => updateInputValue(type, id, "units", e.target.value)}
              />
              <ListComponent
                name="Tag"
                description="List of tags for the dataset."
                fieldName={`inputs.${id}.${type}.tags`}
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                storedData={""}
              />
              <ListComponent
                name="Year"
                description="List years in the dataset."
                fieldName={`inputs.${id}.${type}.years`}
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                storedData={""}
              />
              <ListComponent
                name="Weather Year"
                description="List of weather years used for the dataset."
                fieldName={`inputs.${id}.${type}.weather_years`}
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                storedData={""}
              />
              <ListComponent
                name="Scenario"
                description="List of scenarios in the dataset."
                fieldName={`inputs.${id}.${type}.scenarios`}
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                storedData={""}
              />
              <div key="spatial" className="mb-4 border p-3 rounded">
                <Row><Form.Label className="medium fw-bold">Spatial Dimensions</Form.Label></Row>
                <Form.Label className="small fw-bold">Extent</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="extent"
                  value={inData.spatial_dimensions?.extent || ""}
                  onChange={(e) => updateInputValuelv2(type, id, "spatial_dimensions", "extent", e.target.value)}
                />
                <Form.Label className="small fw-bold">Fidelity</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="fidelity"
                  value={inData.spatial_dimensions?.fidelity || ""}
                  onChange={(e) => updateInputValuelv2(type, id, "spatial_dimensions", "fidelity", e.target.value)}
                />
                <ListComponent
                  name="Scope"
                  description="Dataset spatial scope."
                  fieldName={`inputs.${id}.${type}.spatial_dimensions.scope`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
              </div>
              <div key="temporal" className="mb-4 border p-3 rounded">
                <Row><Form.Label className="medium fw-bold">Temporal Dimensions</Form.Label></Row>
                <Form.Label className="small fw-bold">Extent</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="extent"
                  value={inData.temporal_dimensions?.extent || ""}
                  onChange={(e) => updateInputValuelv2(type, id, "temporal_dimensions", "extent", e.target.value)}
                />
                <Form.Label className="small fw-bold">Resolution</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="resolution"
                  value={inData.temporal_dimensions?.resolution || ""}
                  onChange={(e) => updateInputValuelv2(type, id, "temporal_dimensions", "resolution", e.target.value)}
                />
                <ListComponent
                  name="Year"
                  description="Tool study years."
                  fieldName={`inputs.${id}.${type}.temporal_dimensions.years`}
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
                  fieldName={`inputs.${id}.${type}.temporal_dimensions.weather_years`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
              </div>
            </div>
          );
        })}
        <div className="d-flex justify-content-start mt-2">
          <Dropdown>
            <Dropdown.Toggle
              variant="primary"
              className={`px-4 py-3 actions-dropdown-toggle`}
            >
              <Plus size={16} className="update-button-icon me-1 actions-dropdown-icon" />
              Input
            </Dropdown.Toggle>

            <Dropdown.Menu className="actions-dropdown-menu">
              <Dropdown.Item
                onClick={() => addInput('general_data_description')}
                className="d-flex align-items-center dropdown-item-create"
              >
                <Plus size={16} className="me-2" />
                Create General Input Data Description
              </Dropdown.Item>
              <hr className="dropdown-divider" />
              <Dropdown.Item
                onClick={() => addInput('dataset')}
                className="d-flex align-items-center dropdown-item-create"
              >
                <Plus size={16} className="me-2" />
                Create Published Input Dataset
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};


export default InputsSectionIFAC;
