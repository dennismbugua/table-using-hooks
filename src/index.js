import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Table, Button, Input } from "reactstrap";

function App() {
    const [rows, setRows] = useState([{}]);
    const handleChange = index => e => {
        const { name, value } = e.target;
        const rows = [...rows];
        rows[index] = {
            [name]: value
        };
        setRows(rows);
        console.log(rows);
    };
    const handleAddRow = () => {
        const item = {
            name: "",
            mobile: ""
        };
        setRows([...rows, item]);
        console.log(rows);
    };
    const handleRemoveRow = () => {
        setRows(rows.slice(0, -1));
        console.log(rows);
    };
    const handleRemoveSpecificRow = index => () => {
        const rows = [...rows];
        rows.slice(index, 1);
        console.log(rows);
        setRows([...rows]);
    };
    return (
        <div>
            <Table>
                <thead className="thead-light">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((item, index) => (
                        <tr id="addr" key={index}>
                            <td>{index}</td>
                            <td>
                                <Input
                                    type="text"
                                    name="name"
                                    value={rows[index].name}
                                    onChange={handleChange(index)}
                                />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    name="mobile"
                                    value={rows[index].mobile}
                                    onChange={handleChange(index)}
                                />
                            </td>
                            <td>
                                <Button
                                    outline
                                    color="danger"
                                    onClick={handleRemoveSpecificRow(index)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button color="danger" onClick={handleRemoveRow}>
                Delete Last Row
            </Button>
        </div>
    );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
