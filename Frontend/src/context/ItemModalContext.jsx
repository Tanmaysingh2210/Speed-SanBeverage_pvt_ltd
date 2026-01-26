import { createContext, useContext, useState, useEffect } from "react";
import { useSKU } from "./SKUContext";
import "../pages/transaction/transaction.css";

const ItemModalContext = createContext();

export const ItemModalProvider = ({ children }) => {
  const { items, getAllItems } = useSKU();

  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [onSelectCallback, setOnSelectCallback] = useState(null);

  useEffect(() => {
    if (show) getAllItems();
  }, [show]);

  const openItemModal = (callback) => {
    setOnSelectCallback(() => callback);
    setShow(true);
  };

  const closeItemModal = () => {
    setShow(false);
    setSearch("");
    setOnSelectCallback(null);
  };

  return (
    <ItemModalContext.Provider
      value={{
        openItemModal,
        closeItemModal,
      }}
    >
      {children}

      {/* 🔽 GLOBAL SALESMAN MODAL */}
      {show && (
        <div className="modal-overlay"
        onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>Select Items</h3>
              <button
                className="modal-close-btn"
                onClick={closeItemModal}
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

              {items
                .filter(it =>
                  it.code.toLowerCase().includes(search.toLowerCase()) ||
                  it.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(it => (
                  <div
                    key={it._id}
                    className="modal-row"
                    onClick={() => {
                      onSelectCallback?.(it.code);
                     closeItemModal();
                    }}
                  >
                    <div>{it.code}</div>
                    <div>{it.name}</div>
                    <div
                      className={`status-badge ${
                        it.status === "Inactive" ? "inactive" : "active"
                      }`}
                    >
                      {it.status}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </ItemModalContext.Provider>
  );
};

export const useItemModal = () =>
  useContext(ItemModalContext);
