import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}

function App() {
  // store rows as array of {name, mobile}
  const [rows, setRows] = useLocalStorage("rows", [{ name: "", mobile: "" }]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // ensure at least one empty row
    if (!rows || rows.length === 0) setRows([{ name: "", mobile: "" }]);
  }, []);

  const handleChange = (index, field) => (e) => {
    const value = e.target.value;
    setRows((prev) => {
      const next = prev.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      );
      return next;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, { name: "", mobile: "" }]);
  };

  const handleRemoveLast = () => {
    setRows((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleRemoveAt = index => () => {
    setRows(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ name: "", mobile: "" }];
    });
  };

  const handleInsertAt = index => () => {
    setRows(prev => {
      const next = [...prev];
      next.splice(index + 1, 0, { name: "", mobile: "" });
      return next;
    });
  };

  const filtered = rows
    .map((r, i) => ({ ...r, _i: i }))
    .filter((r) => {
      if (!filter) return true;
      const q = filter.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) || r.mobile.toLowerCase().includes(q)
      );
    });

  const validMobile = (v) => /^[0-9+\-() ]{3,20}$/.test(v || "");

  return (
    <div className="app" role="main">
      <div className="header">
        <div className="title">
          <div className="logo">TB</div>
          <div>
            <h1>Contacts table</h1>
            <div className="subtitle">
              Fast editable rows — keyboard and mobile friendly
            </div>
          </div>
        </div>
        <div className="controls">
          <input
            aria-label="Filter rows"
            className="input"
            placeholder="Search name or mobile..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 220 }}
          />
          <button
            className="btn primary"
            onClick={handleAddRow}
            title="Add Row"
          >
            + Add Row
          </button>
          <button
            className="btn danger"
            onClick={handleRemoveLast}
            title="Delete last row"
            aria-label="Delete last row"
          >
            Delete Last
          </button>
        </div>
      </div>

      <div
        className="tableWrap"
        role="region"
        aria-label="Editable contacts table"
      >
        <table>
          <thead>
            <tr>
              <th className="indexCell">#</th>
              <th>Name</th>
              <th>Mobile</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">
                  No rows match your search. Try clearing the filter or add a
                  new row.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row._i}>
                  <td className="indexCell">{row._i + 1}</td>
                  <td>
                    <input
                      className="input"
                      name="name"
                      value={rows[row._i].name}
                      onChange={handleChange(row._i, "name")}
                      placeholder="Full name"
                      aria-label={`Name for row ${row._i + 1}`}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      name="mobile"
                      value={rows[row._i].mobile}
                      onChange={handleChange(row._i, "mobile")}
                      placeholder="Mobile number"
                      aria-invalid={!validMobile(rows[row._i].mobile)}
                      aria-label={`Mobile for row ${row._i + 1}`}
                    />
                    <div className="small" style={{ marginTop: 6 }}>
                      {rows[row._i].mobile &&
                      !validMobile(rows[row._i].mobile) ? (
                        <span style={{ color: "#fb7185" }}>
                          Invalid phone format
                        </span>
                      ) : (
                        <span className="small">
                          Tip: include country code for reliability
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="actions">
                    <button
                      className="btn"
                      onClick={handleInsertAt(row._i)}
                      aria-label={`Add row after ${row._i + 1}`}
                      title="Insert row below"
                    >
                      Add
                    </button>
                    <button
                      className="btn"
                      onClick={handleRemoveAt(row._i)}
                      aria-label={`Remove row ${row._i + 1}`}
                      title="Remove row"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="hint">
        <span className="rowCount">{rows.length}</span> rows • Changes are saved
        to local storage automatically
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
