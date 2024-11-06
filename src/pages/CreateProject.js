import React, { useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Plus, Minus } from 'lucide-react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PageTitle from '../components/pageTitle';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';

const CreateProject = () => {
    // Assumptions state
    const [assumptions, setAssumptions] = useState(['']);
    const handleAddAssumption = () => {
        setAssumptions([...assumptions, '']);
    };
    const handleRemoveAssumption = (index) => {
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

    const handleAddRequirement = (type) => {
        if (type=="str") {
            const newRequirements = [...requirements, {"": [""]}];
            setRequirments(newRequirements);
        }
        if (type=="int") {
            const newRequirements = [...requirements, {"": [0]}];
            setRequirments(newRequirements);
        }
        const newRequirementsType = [...requirementsType, type];
        setRequirmentsType(newRequirementsType);
    }
    return (
        <Container fluid>
            <Row>
                <PageTitle title="Create Project"/>
            </Row>
            <div className="d-flex justify-content-center">
                <Col className='justify-content-center mw-600' style={{ maxWidth: '1000px' }} xs={12} md={9}>
                <Form className="my-4 justify-content">
                    <Form.Group className="mb-3 w-100" controlId="formProjectName">
                        <Form.Label className="d-block text-start w-100">Project Name</Form.Label>
                        <Form.Control 
                            type="input" 
                            placeholder="Project Name" 
                            className="mb-4"
                        />
        
                        <Form.Label className="d-block text-start w-100">Project Description</Form.Label>
                        <Form.Control 
                            type="input" 
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
                                    {assumptions.length > 1 && (
                                        <Button 
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveAssumption(index)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                    )}
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
                            <div className="d-flex justify-content-start mt-2">
                            <DropdownButton variant="outline-primary"  id="dropdown-item-button" title="Add Requirement">
                                <Dropdown.Item 
                                    as="button"
                                    onClick={() => handleAddRequirement("str")}
                                >
                                    <Plus className="w-1 h-1 mr-1" /> String Requirement
                                </Dropdown.Item>
                                <Dropdown.Item 
                                    as="button"
                                    onClick={() => handleAddRequirement("int")}

                                >
                                        <Plus className="w-1 h-1 mr-1" /> Integer Requirement</Dropdown.Item>
                            </DropdownButton>

                            {/* <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={handleAddRequirement}
                                className="mt-2 align-items-left"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Integer Requirement
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={handleAddRequirement}
                                className="mt-2 align-items-left"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                String Requirement
                            </Button> */}
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