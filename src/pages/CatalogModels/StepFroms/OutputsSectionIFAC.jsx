
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

const OutputsSectionDefaultsIFAC = {
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
// OutputsSection for model creation
const OutputsSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  
  // Use storedData for initial state if present and not empty
  // Convert from list (in db) to dict to make UI actions easier to manage
  const initialOutputs = (storedData.outputs || []).length > 0
    ? storedData.outputs.reduce((accumulator,currentValue) => {
      accumulator[currentValue['name']] = currentValue;
      return accumulator;
    }, {})
    : { input_default: OutputsSectionDefaultsIFAC['general_data_description'] };

  const [outputs, setOutputs] = useState(initialOutputs);
  const [inputIds, setOutputIds] = useState(Object.keys(initialOutputs));

  // Prefill from zustand store if available when mounting or when storedData changes
  useEffect(() => {
    if (Object.keys(storedData.outputs || {}).length > 0) {
      setOutputs(storedData.outputs);
      setOutputIds(Object.keys(storedData.outputs));
      setValue("outputs", storedData.outputs);
    }
  }, [storedData, setValue]);

  const addOutput = (type) => {
    const timestamp = Date.now();
    const newId = `input_${timestamp}`;
    const newOutputs = {
      ...outputs,
      [newId]: OutputsSectionDefaultsIFAC[type]
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
    setOutputIds([...inputIds, newId]);
  };

  const removeOutput = (id) => {
    const { [id]: removed, ...rest } = outputs;
    setOutputs(rest);
    setValue("outputs", rest);
    setOutputIds(inputIds.filter(inId => inId !== id));
  };

  const updateOutputName = (type, id, newName) => {
    const newOutputs = {
      ...outputs,
      [id]: {
        ...outputs[id],
        [type]: {
        ...outputs[id][type],
        name: newName
        }
      }
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const updateOutputValue = (type, id, key, value) => {
    const newOutputs = {
      ...outputs,
      [id]:{
        ...outputs[id],
        [type]: {
        ...outputs[id][type],
        [key]: value
      }}
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const updateOutputValuelv2 = (type, id, key1, key2, value) => {
    const newOutputs = {
      ...outputs,
      [id]:{
        ...outputs[id],
        [type]: {
        ...outputs[id][type],
        [key1]: {
          ...outputs[id][type][key1],
          [key2]: value
        }
      }}
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const toggleOutputType = (id) => {
    const currentType = outputs[id]?.type;
    const newType = currentType === "string" ? "object" : "string";
    let newValue;
    if (newType === "string") {
      newValue = "";
    } else {
      newValue = { "": "", "": "" };
    }
    const newOutputs = {
      ...outputs,
      [id]: {
        ...outputs[id],
        type: newType,
        value: newValue
      }
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const addObjectField = (inId) => {
    const outData = outputs[inId];
    if (!outData || outData.type !== "object") return;
    const updatedValue = {
      ...outData.value,
      [""]: ""
    };
    const updatedOutput = {
      ...outData,
      value: updatedValue
    };
    const newOutputs = {
      ...outputs,
      [inId]: updatedOutput
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const updateObjectFieldValue = (inId, fieldKey, fieldValue) => {
    const outData = outputs[inId];
    if (!outData || outData.type !== "object") return;
    const updatedValue = {
      ...outData.value,
      [fieldKey]: fieldValue
    };
    const updatedOutput = {
      ...outData,
      value: updatedValue
    };
    const newOutputs = {
      ...outputs,
      [inId]: updatedOutput
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const updateObjectFieldKey = (inId, oldKey, newKey) => {
    if (!newKey || oldKey === newKey) return;
    const outData = outputs[inId];
    if (!outData || outData.type !== "object") return;
    if (Object.prototype.hasOwnProperty.call(outData.value, newKey) && oldKey !== newKey) {
      return;
    }
    const updatedValue = {};
    Object.entries(outData.value).forEach(([key, value]) => {
      if (key === oldKey) {
        updatedValue[newKey] = value;
      } else {
        updatedValue[key] = value;
      }
    });
    const updatedOutput = {
      ...outData,
      value: updatedValue
    };
    const newOutputs = {
      ...outputs,
      [inId]: updatedOutput
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  const removeObjectField = (inId, fieldKey) => {
    const outData = outputs[inId];
    if (!outData || outData.type !== "object") return;
    const fieldKeys = Object.keys(outData.value || {});
    if (fieldKeys.length <= 1) return;
    const updatedValue = {};
    Object.entries(outData.value).forEach(([key, value]) => {
      if (key !== fieldKey) {
        updatedValue[key] = value;
      }
    });
    const updatedOutput = {
      ...outData,
      value: updatedValue
    };
    const newOutputs = {
      ...outputs,
      [inId]: updatedOutput
    };
    setOutputs(newOutputs);
    setValue("outputs", newOutputs);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Outputs</span>
      </Form.Label>
      <div>
        {inputIds.map((id, idx) => {
          const type = outputs[id]['type'];
          const outData = outputs[id][type];
          if (!outData) return null;
          return (
            <div key={id} className="mb-4 border p-3 rounded">
              <Form.Label className="small fw-bold">Output Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Output"
                value={outData.name || ""}
                onChange={(e) => updateOutputName(type, id, e.target.value)}
              />
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() => removeOutput(id)}
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
                value={outData.description || ""}
                onChange={(e) => updateOutputValue(type, id, "description", e.target.value)}
              />
              <Form.Label className="small fw-bold">Category</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Category"
                value={outData.category || ""}
                onChange={(e) => updateOutputValue(type, id, "category", e.target.value)}
              />
              {type === "dataset" ? (
                <div>
                <Form.Label className="small fw-bold">Author</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="Author"
                  value={outData.author || ""}
                  onChange={(e) => updateOutputValue(type, id, "author", e.target.value)}
                />
                <Form.Label className="small fw-bold">Date</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="YYYY-MM-DD hh:mm:ss"
                  value={outData.date || ""}
                  onChange={(e) => updateOutputValue(type, id, "date", e.target.value)}
                />
                <Form.Label className="small fw-bold">Version</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="Version"
                  value={outData.version || ""}
                  onChange={(e) => updateOutputValue(type, id, "version", e.target.value)}
                />
                <Form.Label className="small fw-bold">Location</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="Location"
                  value={outData.location || ""}
                  onChange={(e) => updateOutputValue(type, id, "location", e.target.value)}
                />
                </div>
              ):(<div></div>)}
              <Form.Label className="small fw-bold">Priority</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Priority"
                value={outData.priority || ""}
                onChange={(e) => updateOutputValue(type, id, "priority", e.target.value)}
              />
              <Row>
                <Col>
                <Form.Label className="small fw-bold">Private</Form.Label>
                <Form.Check
                  type="switch"
                  defaultChecked={outData.private || false}
                  onChange={(e) => updateOutputValue(type, id, "private", e.target.checked)}
                />
                </Col><Col>
                <Form.Label className="small fw-bold">NDA</Form.Label>
                <Form.Check
                  type="switch"
                  defaultChecked={outData.NDA || false}
                  onChange={(e) => updateOutputValue(type, id, "NDA", e.target.checked)}
                />
                </Col>
              </Row>
              <Form.Label className="small fw-bold">Provider</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Provider"
                value={outData.provider || ""}
                onChange={(e) => updateOutputValue(type, id, "provider", e.target.value)}
              />
              <Form.Label className="small fw-bold">Units</Form.Label>
              <Form.Control
                type="text"
                className="form-control-lg form-primary-input"
                placeholder="Units"
                value={outData.units || ""}
                onChange={(e) => updateOutputValue(type, id, "units", e.target.value)}
              />
              <ListComponent
                name="Tag"
                description="List of tags for the dataset."
                fieldName={`outputs.${id}.${type}.tags`}
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
                fieldName={`outputs.${id}.${type}.years`}
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
                fieldName={`outputs.${id}.${type}.weather_years`}
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
                fieldName={`outputs.${id}.${type}.scenarios`}
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
                  value={outData.spatial_dimensions.extent || ""}
                  onChange={(e) => updateOutputValuelv2(type, id, "spatial_dimensions", "extent", e.target.value)}
                />
                <Form.Label className="small fw-bold">Fidelity</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="fidelity"
                  value={outData.spatial_dimensions.fidelity || ""}
                  onChange={(e) => updateOutputValuelv2(type, id, "spatial_dimensions", "fidelity", e.target.value)}
                />
                <ListComponent
                  name="Scope"
                  description="Dataset spatial scope."
                  fieldName={`outputs.${id}.${type}.spatial_dimensions.scope`}
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
                  value={outData.temporal_dimensions.extent || ""}
                  onChange={(e) => updateOutputValuelv2(type, id, "temporal_dimensions", "extent", e.target.value)}
                />
                <Form.Label className="small fw-bold">Resolution</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-lg form-primary-input"
                  placeholder="resolution"
                  value={outData.temporal_dimensions.resolution || ""}
                  onChange={(e) => updateOutputValuelv2(type, id, "temporal_dimensions", "resolution", e.target.value)}
                />
                <ListComponent
                  name="Year"
                  description="Tool study years."
                  fieldName={`outputs.${id}.${type}.temporal_dimensions.years`}
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
                  fieldName={`outputs.${id}.${type}.temporal_dimensions.weather_years`}
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  storedData={""}
                />
              </div>
              {/*TODO: Add schema/spatial/temporal blocks (refactor spatial/temporal/environmental out of requirements into separate jsx*/}
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
              Output
            </Dropdown.Toggle>

            <Dropdown.Menu className="actions-dropdown-menu">
              <Dropdown.Item
                onClick={() => addOutput('general_data_description')}
                className="d-flex align-items-center dropdown-item-create"
              >
                <Plus size={16} className="me-2" />
                Create General Output Data Discription
              </Dropdown.Item>
              {/*<hr className="dropdown-divider" />
              <Dropdown.Item
                onClick={() => addOutput('dataset')}
                className="d-flex align-items-center dropdown-item-create"
              >
                <Plus size={16} className="me-2" />
                Create Published Output Dataset
              </Dropdown.Item>*/}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};


export default OutputsSectionIFAC;
