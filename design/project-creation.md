## Design Patterns for forms

### Form Creaation

Within `/pages`, make your form `js` file. For post forms, label `Create[formpurpose]`. For update forms, label `upddate[purpose]`. Create your corresponding component.

### Page Layout

1. Import correct dependencies.

"""[js]
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Plus, Minus } from "lucide-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

import PageTitle from "../components/pageTitle";
import SideColumn from "../components/form/SideColumn";
import useDataStore from "../pages/stores/DataStore";
import useAuthStore from "../pages/stores/AuthStore";
import FormError from "../components/form/FormError";
import "./FormStyles.css";
"""

2. Layout the page. Make state variable for isExpanded

"""[js]

<Container fluid className="p-0">
  <Row className="g-0" style={{ display: "flex", flexDirection: "row" }}>
    <Col style={{ flex: 1, transition: "margin-left 0.3s ease" }}>...</Col>
    <div
      style={{
        width: isExpanded ? "calc(30vw + 40px)" : "40px",
        transition: "width 0.3s ease",
        flexShrink: 0,
      }}
    >
      <SideColumn
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        documentation={documentation}
      />
    </div>
  </Row>
</Container>
```

3. Form compoents: mapping form layout to react forms can be tough. Here is a guide to help work for basic datastructures found in `pipes-api`.

a) Simple Textbox
i. In state, make your state variable:
`const [projectName, setProjectName] = useState("example project");`
ii. In code,

"""[js]
<Form.Label
id="projectNameLabel"
className="d-block text-start w-100 custom-form-label requiredField" >
Project Name
</Form.Label>
<Form.Control
type="input"
id="projectName"
placeholder="Project Name"
className="mb-4"
value={projectName}
onChange={(e) => setProjectName(e.target.value)}
/>
"""

b) Handling large text boxes. Project description is a good example of this pattern. Include `as=textarea` in the control.

"""[js]
<Form.Control
as="textarea"
rows={3}
placeholder="Describe your project"
className="mb-4"
value={projectDescription}
onChange={(e) => setProjectDescription(e.target.value)}
/>
"""

c) Handling Schedule Start and Schedule End. Simply, copy code from `CreateProject.js`. In state include

```[js]
  // Setting project Schedule
  const [schedule, setSchedule] = useState({
    scheduledStart: "2023-01-01",
    scheduledEnd: "2023-12-31",
  });

  const handleDateChange = (field, value) => {
    setSchedule({
      ...schedule,
      [field]: value,
    });
  };
```

In code include:

```[js]
<Row>
  <Col md={6} className="mb-3">
    <Form.Group>
      <Form.Label className="d-block text-start custom-form-label requiredField">
        Scheduled Start
      </Form.Label>
      <Form.Control
        id="scheduledStart"
        type="date"
        value={schedule.scheduledStart || ""}
        onChange={(e) =>
          handleDateChange("scheduledStart", e.target.value)
        }
      />
    </Form.Group>
  </Col>
  <Col md={6} className="mb-3">
    <Form.Group>
      <Form.Label className="d-block text-start custom-form-label requiredField">
        Scheduled End
      </Form.Label>
      <Form.Control
        id="scheduledEnd"
        type="date"
        value={schedule.scheduledEnd || ""}
        onChange={(e) =>
          handleDateChange("scheduledEnd", e.target.value)
        }
      />
    </Form.Group>
  </Col>
</Row>
```

Notice: from here on, we are going to be defining data structures that build on top of each other.

4. Defining lists.

a) In state, include something to the effect of:
`[js]const [assumptions, setAssumptions] = useState(["Assumption 1"]);`
b) Include a `handlers`.

i) The following logic will add, remove, and change the list:

```[js]
  const handleAddAssumption = (e) => {
    e.preventDefault();
    setAssumptions([...assumptions, ""]);
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
```

In essance, the `...assumptions` creates a shallow copy of the current list, then adds a new element `""`. For the remove, we pass in the element as `_`, then we filter where we want to remove an element at an index. After each, we set the assumptions again.

ii) What is happening, is that we are mapping or looping over the variable in state. To the right, we have a minus sign. Below, we can add to the list. Notice that we are on change, calling its associated handler through `handleAssumptionChange`. On delete, we are using `handleRemoveAssumption`.

```[js]
<Form.Label className="d-block text-start w-100 custom-form-label">
  Assumptions
</Form.Label>
{assumptions.map((assumption, index) => (
  <div
    key={index}
    className="d-flex mb-2 align-items-center gap-2"
  >
    <Form.Control
      type="input"
      placeholder="Enter assumption"
      value={assumption}
      onChange={(e) =>
        handleAssumptionChange(index, e.target.value)
      }
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
```

5. Handling dictionaries `str: list[str]`.

Include form styles for necessary fields
