import React, { useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Plus, Minus } from 'lucide-react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PageTitle from '../components/pageTitle';
import DropdownButton from 'react-bootstrap/DropdownButton';

const CreateProject = () => {
    // Assumptions state
    const [assumptions, setAssumptions] = useState([]);
    const handleAddAssumption = (e) => {
        e.preventDefault();
        setAssumptions([...assumptions, '']);
    };
    const handleRemoveAssumption = (index, e) => {
        e.preventDefault();
        const newAssumptions = assumptions.filter((_, idx) => idx !== index);
        setAssumptions(newAssumptions);
    };
    const handleAssumptionChange = (index, value) => {
        const newAssumptions = [...assumptions];
        newAssumptions[index] = value;
        setAssumptions(newAssumptions);
    };

    // Requirement state
    const [requirements, setRequirments] = useState([]);
    const [requirementsType, setRequirmentsType] = useState([]);

    const handleAddRequirement = (type, e) => {
        e.preventDefault();
        // Initialize with an empty requirement name and an array with one default value
        const defaultValue = type === "int" ? 0 : "";
        const newRequirements = [...requirements, { "": [defaultValue] }];
        setRequirments(newRequirements);
        
        const newRequirementsType = [...requirementsType, type];
        setRequirmentsType(newRequirementsType);
    };

    const handleRemoveRequirement = (index, e) => {
        e.preventDefault();
        const newRequirements = requirements.filter((_, idx) => idx !== index);
        setRequirments(newRequirements);
        
        const newRequirementsType = requirementsType.filter((_, idx) => idx !== index);
        setRequirmentsType(newRequirementsType);
    };

    // New function to handle adding a sub-requirement value
    const handleAddSubRequirement = (requirementIndex, e) => {
        e.preventDefault();
        const newRequirements = [...requirements];
        const requirement = newRequirements[requirementIndex];
        const requirementName = Object.keys(requirement)[0];
        const defaultValue = requirementsType[requirementIndex] === "int" ? 0 : "";
        
        requirement[requirementName] = [...requirement[requirementName], defaultValue];
        setRequirments(newRequirements);
    };

    // New function to handle removing a sub-requirement value
    const handleRemoveSubRequirement = (requirementIndex, valueIndex, e) => {
        e.preventDefault();
        const newRequirements = [...requirements];
        const requirement = newRequirements[requirementIndex];
        const requirementName = Object.keys(requirement)[0];
        
        requirement[requirementName] = requirement[requirementName].filter((_, idx) => idx !== valueIndex);
        setRequirments(newRequirements);
    };

    // New function to handle requirement name changes
    const handleRequirementNameChange = (requirementIndex, newName) => {
        const newRequirements = [...requirements];
        const requirement = newRequirements[requirementIndex];
        const oldName = Object.keys(requirement)[0];
        const values = requirement[oldName];
        
        // Create new object with updated name but same values
        newRequirements[requirementIndex] = { [newName]: values };
        setRequirments(newRequirements);
    };

    // New function to handle requirement value changes
    const handleRequirementValueChange = (requirementIndex, valueIndex, newValue) => {
        const newRequirements = [...requirements];
        const requirement = newRequirements[requirementIndex];
        const requirementName = Object.keys(requirement)[0];
        
        // Handle type conversion for integers
        if (requirementsType[requirementIndex] === "int") {
            const intValue = parseInt(newValue) || 0;
            requirement[requirementName][valueIndex] = intValue;
        } else {
            requirement[requirementName][valueIndex] = newValue;
        }
        
        setRequirments(newRequirements);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    return (
        <Container fluid>
            <Row>
                <PageTitle title="Create Project"/>
            </Row>
            <div className="d-flex justify-content-center">
                <Col className='justify-content-center mw-600' style={{ maxWidth: '1000px' }} xs={12} md={9}>
                <Form className="my-4 justify-content" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 w-100" controlId="formProjectName">
                        <Form.Label className="d-block text-start w-100">Project Name</Form.Label>
                        <Form.Control 
                            type="input" 
                            placeholder="Project Name" 
                            className="mb-4"
                        />
        
                        <Form.Label className="d-block text-start w-100">Project Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            placeholder="Describe your project" 
                            className="mb-4"
                        />
        
                        <div className="mb-3">
                            <Form.Label className="d-block text-start w-100">Assumptions</Form.Label>
                            
                            {assumptions.map((assumption, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center gap-2">
                                    <Form.Control
                                        type="input"
                                        placeholder="Enter assumption"
                                        value={assumption}
                                        onChange={(e) => handleAssumptionChange(index, e.target.value)}
                                    />
                                    <Button 
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={(e) => handleRemoveAssumption(index, e)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <div className="d-flex justify-content-start mt-2">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={handleAddAssumption}
                                    className="mt-2 align-items-left"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Assumption
                                </Button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <Form.Label className="d-block text-start w-100">Requirements</Form.Label>
                            <div className='d-block'>
                                {requirements.map((requirement, requirements_i) => {
                                    const requirementName = Object.keys(requirement)[0];
                                    const values = requirement[requirementName];
                                    const type = requirementsType[requirements_i];

                                    return (
                                        <div key={requirements_i}>
                                            {values.map((value, value_i) => (
                                                <Row key={`${requirements_i}-${value_i}`} className="mb-2 align-items-center">
                                                    {/* Only show remove requirement button and name field for first row */}
                                                    {value_i === 0 ? (
                                                        <>
                                                            <Col xs="auto">
                                                                <Button 
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={(e) => handleRemoveRequirement(requirements_i, e)}
                                                                    style={{ width: '32px', height: '32px', padding: '4px' }}
                                                                    className="d-flex align-items-center justify-content-center"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </Button>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <Form.Control 
                                                                    type="text" 
                                                                    placeholder="Requirement"
                                                                    value={requirementName}
                                                                    onChange={(e) => handleRequirementNameChange(requirements_i, e.target.value)}
                                                                />
                                                            </Col>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Col xs="auto">
                                                                <div style={{ width: '32px' }}></div>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <div></div>
                                                            </Col>
                                                        </>
                                                    )}
                                                    <Col>
                                                        <Form.Control 
                                                            type={type === "int" ? "number" : "text"}
                                                            placeholder={type === "int" ? "Enter number" : "Enter value"}
                                                            value={value}
                                                            onChange={(e) => handleRequirementValueChange(requirements_i, value_i, e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col xs="auto">
                                        {values.length > 1 && ( // Only show delete button if there's more than one value
                                            <Button 
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={(e) => handleRemoveSubRequirement(requirements_i, value_i, e)}
                                                style={{ width: '32px', height: '32px', padding: '4px' }}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </Col>
                                                </Row>
                                            ))}
                                            <Row>
                                                <Col xs="auto">
                                                    <div style={{ width: '32px' }}></div>
                                                </Col>
                                                <Col xs={3}>
                                                </Col>
                                                <Col>
                                                    <div className="d-flex mb-3">
                                                        <Button 
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={(e) => handleAddSubRequirement(requirements_i, e)}
                                                            style={{ width: '32px', height: '32px', padding: '4px' }}
                                                            className="d-flex align-items-center justify-content-center"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div style={{ width: '32px' }}></div>
                                                </Col>
                                            </Row>
                                        </div>
                                    );
                                })}
                            </div>



                            <Row>
                            </Row>
                            <div className="d-flex justify-content-start mt-2">
                                <DropdownButton variant="outline-primary" id="dropdown-item-button" title="Add Requirement">
                                    <Dropdown.Item 
                                        as="button"
                                        onClick={(e) => handleAddRequirement("str", e)}
                                    >
                                        <Plus className="w-1 h-1 mr-1" /> String Requirement
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        as="button"
                                        onClick={(e) => handleAddRequirement("int", e)}
                                    >
                                        <Plus className="w-1 h-1 mr-1" /> Integer Requirement
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                    </Form.Group>
        
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                </Col>
            </div>
        </Container>
    );
};

export default CreateProject;