import { createContext, useContext, useState, useEffect } from "react";
import { useSalesman } from "./SalesmanContext";
import "../pages/transaction/transaction.css";

const SalesmanModalContext = createContext();

export const SalesmanModalProvider = ({ children }) => {
  const { salesmans } = useSalesman();

  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [onSelectCallback, setOnSelectCallback] = useState(null);



  const openSalesmanModal = (callback) => {
    setOnSelectCallback(() => callback);
    setShow(true);
  };

  const closeSalesmanModal = () => {
    setShow(false);
    setSearch("");
    setOnSelectCallback(null);
  };

  return (
    <SalesmanModalContext.Provider
      value={{
        openSalesmanModal,
        closeSalesmanModal,
      }}
    >
      {children}

      {/* 🔽 GLOBAL SALESMAN MODAL */}
      {show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Select Salesman</h3>
              <button
                className="modal-close-btn"
                onClick={closeSalesmanModal}
              >
                ✕
              </button>
            </div>

            <input
              className="modal-search"
              placeholder="Search by code or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="modal-table">
              <div className="modal-row modal-head">
                <div>Code</div>
                <div>Name</div>
                <div>Status</div>
              </div>

              {salesmans
                .filter(sm =>
                  sm.codeNo.toLowerCase().includes(search.toLowerCase()) ||
                  sm.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(sm => (
                  <div
                    key={sm._id}
                    className="modal-row"
                    onClick={() => {
                      onSelectCallback?.(sm.codeNo);
                      closeSalesmanModal();
                    }}
                  >
                    <div>{sm.codeNo}</div>
                    <div>{sm.name}</div>
                    <div
                      className={`status-badge ${
                        sm.status === "Inactive" ? "inactive" : "active"
                      }`}
                    >
                      {sm.status}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </SalesmanModalContext.Provider>
  );
};

export const useSalesmanModal = () =>
  useContext(SalesmanModalContext);
