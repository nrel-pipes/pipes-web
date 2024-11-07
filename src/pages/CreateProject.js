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
        e.preventDefault(); // Prevent form submission
        setAssumptions([...assumptions, '']);
    };
    const handleRemoveAssumption = (index, e) => {
        e.preventDefault(); // Prevent form submission
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
        e.preventDefault(); // Prevent form submission
        if (type === "str") {
            const newRequirements = [...requirements, {"": [""]}];
            setRequirments(newRequirements);
        }
        if (type === "int") {
            const newRequirements = [...requirements, {"": [0]}];
            setRequirments(newRequirements);
        }
        const newRequirementsType = [...requirementsType, type];
        setRequirmentsType(newRequirementsType);
        console.log(requirements, requirementsType);
    };
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission on submit button
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
                    {/* Rest of your form content remains the same */}
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
    {requirements.map((requirement, requirements_i) => (
        <div key={requirements_i}>
            <Row className="mb-2 align-items-center">
                <Col xs="auto">
                    <Button 
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => handleRemoveAssumption(requirements_i, e)}
                        style={{ width: '32px', height: '32px', padding: '4px' }}
                        className="d-flex align-items-center justify-content-center"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                </Col>
                <Col xs={3}>
                    <Form.Control type="text" placeholder="Requirement" />
                </Col>
                <Col>
                    <Form.Control type="text" placeholder="" />
                </Col>
                <Col xs="auto">
                    <Button 
                        variant="outline-danger"
                        size="sm"
                        // onClick={(e) => handleRemoveAssumption(requirements_i, e)}
                        style={{ width: '32px', height: '32px', padding: '4px' }}
                        className="d-flex align-items-center justify-content-center"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col xs="auto">
                    {/* Empty column to match first minus button */}
                </Col>
                <Col xs={3}>
                    {/* Empty column to match requirement field */}
                </Col>
                <Col>
                    <div className="d-flex mb-3">
                        <Button 
                            variant="outline-success"
                            size="sm"
                            // onClick={(e) => handleRemoveSubRequirement(requirements_i, e)}
                            style={{ width: '32px', height: '32px', padding: '4px', marginLeft: 36 }}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </Col>
                <Col xs="auto">
                    {/* Empty column to match last minus button */}
                </Col>
            </Row>
        </div>
    ))}
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