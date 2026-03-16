import { useState, useEffect, useRef } from "react";
import { Paperclip, SendHorizontal, Table, X } from "lucide-react";

export default function Chat() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const [tables, setTables] = useState([
    {
      id: "1",
      name: "Customer Behaviour (Online vs Offline).csv",
      tableName: "dataset_1773654054732",
      columns: "[Age, Monthly_Income, Daily_Income_Hours]",
      createdAt: "2026-03-16T18:32:21",
    },
    {
      id: "2",
      name: "sales_data.csv",
      tableName: "dataset_1773659991122",
      columns: "[region, product, revenue]",
      createdAt: "2026-03-17T11:15:02",
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || isUploading) return;

    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);
    e.target.value = "";

    let finished = false;

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          if (!finished) {
            finished = true;

            const id = crypto.randomUUID();

            const newTable = {
              id,
              name: selectedFile.name,
              tableName: `dataset_${Date.now()}`,
              columns: "[Column1, Column2]",
              createdAt: new Date().toISOString(),
            };

            setTables((prev) => [...prev, newTable]);
            setSelectedTable(newTable);

            setIsUploading(false);
            setFile(null);
          }

          return 100;
        }

        return prev + 10;
      });
    }, 200);
  };

  const sendMessage = () => {
    if (!input.trim() && !file) return;

    const msg = {
      id: crypto.randomUUID(),
      text: input,
      sender: "user",
      file,
      table: selectedTable
        ? { id: selectedTable.id, name: selectedTable.name }
        : null,
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
    setFile(null);
    setSelectedTable(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl font-semibold text-gray-500 text-center">
              Add your CSV file and analyze / visualize your data using AI
            </h1>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-xl max-w-md shadow-sm
                  ${
                    m.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  {m.text}

                  {m.table && (
                    <div className="mt-2 text-sm opacity-80">
                      🧾 Table: {m.table.name}
                    </div>
                  )}

                  {m.file && (
                    <div className="mt-2 text-sm opacity-80">
                      📎 {m.file.name}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        {selectedTable && (
          <div className="mb-2 flex items-center gap-3 text-sm text-gray-700 rounded-lg bg-blue-50 border border-blue-200 max-w-fit p-3">
            <div className="flex items-center gap-2">
              <Table className="text-blue-500" />
              <span className="font-medium">Using table:</span>
              <span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedTable.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTable(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File Upload */}
          <label className="cursor-pointer p-2 rounded-lg hover:bg-gray-200">
            <Paperclip />
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>

          {/* View Tables */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            <Table />
          </button>

          {/* Input */}
          <textarea
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={isUploading}
            className={`p-2 rounded-lg text-white ${
              isUploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <SendHorizontal />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Uploaded Tables</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50
              ${
                selectedTable?.id === table.id
                  ? "border-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => {
                setSelectedTable(table);
                setDrawerOpen(false);
              }}
            >
              <p className="font-medium">{table.name}</p>

              <p className="text-sm text-gray-500">{table.tableName}</p>

              <p className="text-xs text-gray-400 mt-1">
                Columns: {table.columns}
              </p>

              <p className="text-xs text-gray-400">{table.createdAt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Progress Dialog */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Uploading {file?.name}
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {uploadProgress}% complete
            </p>
          </div>
        </div>
      )}
    </div>
  );
}