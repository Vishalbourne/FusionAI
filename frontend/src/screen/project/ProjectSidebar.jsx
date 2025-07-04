import React, { useContext, useEffect, useState, useRef } from "react";
import { marked } from "marked";
import axios from "../../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../../config/socket";
import { UserContext } from "../../context/UserContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getWebContainerInstance } from "../../config/webContainer";
import toast from "react-hot-toast";

const ProjectSidebar = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const [IframeUrl, setIframeUrl] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [rightSection, setRightSection] = useState(false);
  const [runProcess, setRunProcess] = useState(null);
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);
  const projectId = data.proj._id;
  const [showTopShadow, setShowTopShadow] = useState(false);


  useEffect(() => {
    const socket = initializeSocket(projectId);

    if (!webContainer) {
      getWebContainerInstance().then((container) => setWebContainer(container));
    }

    axios
      .get(`/api/messages/all/${projectId}`)
      .then((res) => {
        const wrapperArray = res.data;
        const rawMessages =
          Array.isArray(wrapperArray) && wrapperArray[0]?.messages
            ? wrapperArray[0].messages
            : wrapperArray.messages || [];
        appendIncomingMessage(rawMessages);
      })
      .catch((err) => console.error("Error fetching messages:", err));

    receiveMessage("projectMessage", (data) => {
      appendIncomingMessage(data);
    });

    axios
      .get("/api/users/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Error fetching users:", err));
  }, [projectId]);

  const handleSidePlane = () => {
    setIsOpen(!isOpen);
    axios
      .get(`/api/projects/getProject/${projectId}`)
      .then((res) => setProjectUsers(res.data.users));
  };

  const send = () => {
    if (message.trim() === "") return;
    const messageData = { userId: user.id, projectId, message };
    sendMessage("projectMessage", messageData);
    setMessage("");
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAddCollaborators = () => {
    setIsModalOpen(false);
    axios
      .put("/api/projects/addUser", { users: selectedUsers, projectId })
      .then(() => setSelectedUsers([]))
      .catch((err) => console.error("Error adding collaborators:", err));
  };

  const appendIncomingMessage = (incoming) => {
    if (!messageBox.current) return;
    const messages = Array.isArray(incoming) ? incoming : [incoming];
    messages.forEach((message, index) => {
      const email = message.senderId?.email || "ai@yourapp.com";
      const content = message.content || "";
      const key = message._id || `message-${index}`;
      const el = document.createElement("div");

      if (email === "ai@yourapp.com") {
        el.className =
          "flex flex-col max-w-72 max-h-96 overflow-x-auto bg-green-100 dark:bg-green-700 p-3 rounded-lg shadow-sm border-l-4 border-green-500";
        el.setAttribute("data-key", key);
        const contentMarked = marked.parse(content);
        const htmlDecoded = new DOMParser().parseFromString(contentMarked, "text/html").body.textContent;
        const parsed = JSON.parse(htmlDecoded);

        webContainer?.mount(parsed.fileTree);
        if (parsed.fileTree) setFileTree(parsed.fileTree);
        el.innerHTML = `
          <small class="text-xs opacity-70">AI Assistant</small>
          <div class="mt-1 markdown-content">${parsed.text}</div>
        `;
      } else if (email !== user.email) {
        el.className =
          "flex flex-col max-w-72 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-sm";
        el.setAttribute("data-key", key);
        el.innerHTML = `
          <small class="text-xs opacity-70">${email}</small>
          <p class="mt-1">${content}</p>
        `;
      } else {
        el.className =
          "flex flex-col max-w-72 ml-auto bg-blue-300 dark:bg-blue-600 p-3 rounded-lg shadow-sm";
        el.setAttribute("data-key", key);
        el.innerHTML = `
          <small class="text-xs ml-auto opacity-70">${email}</small>
          <p class="mt-1">${content}</p>
        `;
      }

      messageBox.current.appendChild(el);
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    });
  };

  return (
    <main className="w-screen h-screen flex flex-col md:flex-row bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Left Sidebar */}
      <section className="left w-full md:w-1/3 xl:min-w-[350px] flex flex-col border-r dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
        <header className="h-14 bg-gray-200 dark:bg-gray-800 flex items-center justify-between px-3 md:px-4">
          <button
            className="flex items-center gap-2 text-sm md:text-base font-medium cursor-pointer px-2 md:px-3 py-1 md:py-2 dark:bg-blue-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-user-shared-line text-base md:text-lg"></i>
            Add Collaborator
          </button>

          <button
            className="text-lg md:text-xl cursor-pointer p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
            onClick={handleSidePlane}
          >
            <i className="ri-team-fill"></i>
          </button>
        </header>

        {/* Messages */}
        <div
          className="flex-1 relative p-2 md:p-4 space-y-4 overflow-y-auto custom-scrollbar"
          ref={messageBox}
        >
          <div
            className={`pointer-events-none absolute left-0 right-0 top-0 h-4 z-10 transition-opacity duration-300 ${showTopShadow ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.12), transparent)'
            }}
          />
        </div>

        {/* Input */}
        <div className="p-2 md:p-3 border-t dark:border-gray-700 flex items-center gap-2">
          <input
            type="text"
            value={message}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded-full outline-none"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer"
            onClick={send}
          >
            <i className="ri-send-plane-fill text-base md:text-lg"></i>
          </button>
        </div>
      </section>

      {/* Right Section */}
      {fileTree && rightSection && (
        <section className="right w-full md:w-2/3 h-full flex flex-col relative">
          {/* Mobile close button */}
          <button
            className="md:hidden absolute top-2 right-2 text-2xl text-gray-800 dark:text-gray-100 bg-gray-300 dark:bg-gray-700 p-2 rounded"
            onClick={() => setRightSection(false)}
          >
            <i className="ri-close-line"></i>
          </button>

          {/* Explorer + Editor */}
          <div className="flex flex-col md:flex-row flex-grow h-full">
            {/* File Explorer */}
            <div className="w-full md:w-60 bg-slate-200 dark:bg-gray-800 border-r dark:border-gray-700">
              <div
                className="w-full text-left px-4 py-2 font-bold text-lg md:text-2xl bg-slate-300 dark:bg-gray-900 hover:bg-slate-400 cursor-pointer flex justify-between"
                onClick={() => setRightSection(!rightSection)}
              >
                <p className="m-0">Files</p>
                <i className="ri-arrow-left-line text-xl"></i>
              </div>
              <div className="file-tree h-full overflow-y-auto p-2 space-y-1">
                {Object.keys(fileTree).map((file, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 rounded-md bg-slate-300 dark:bg-gray-700 hover:bg-slate-400 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                    onClick={() => {
                      setCurrentFile(file);
                      setOpenFiles([...new Set([...openFiles, file])]);
                    }}
                  >
                    <p className="font-semibold truncate">{file}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Editor & Tabs */}
            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex justify-between bg-gray-700 text-white px-2 py-1 items-center">
                <div className="flex gap-1 overflow-x-auto max-w-full">
                  {openFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-3 py-1 rounded-t-md ${
                        currentFile === file
                          ? "bg-slate-200 text-black dark:bg-gray-600 dark:text-white"
                          : "bg-slate-400 dark:bg-gray-700 hover:bg-slate-500 dark:hover:bg-gray-600"
                      }`}
                    >
                      <button onClick={() => setCurrentFile(file)}>
                        {file}
                      </button>
                      <i
                        className="ri-close-line ml-2 cursor-pointer hover:text-red-500"
                        onClick={() => {
                          if (currentFile === file) setCurrentFile(null);
                          setOpenFiles(openFiles.filter((f) => f !== file));
                        }}
                      />
                    </div>
                  ))}
                </div>

                {webContainer && (
                  <button
                    disabled={isDisable}
                    className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow-md transition ${
                      isDisable
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={async () => {
                      await webContainer?.mount(fileTree);
                      setIsDisable(true);

                      const installProcess = await webContainer.spawn(
                        "npm",
                        ["install"]
                      );

                      installProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            console.log(chunk);
                            toast.success("Installing dependencies...");
                          },
                        })
                      );

                      await installProcess.exit;
                      setIsDisable(false);

                      if (runProcess) runProcess.kill();

                      const tempRunProcess = await webContainer?.spawn(
                        "npm",
                        ["start"]
                      );
                      tempRunProcess.output.pipeTo(
                        new WritableStream({
                          write(chunk) {
                            toast.success("Running the project...");
                          },
                        })
                      );

                      setRunProcess(tempRunProcess);

                      webContainer.on("server-ready", (port, url) => {
                        setIframeUrl(url);
                      });
                    }}
                  >
                    {runProcess === null ? "Install & Run" : "Run Again"}
                  </button>
                )}
              </div>

              <div className="flex-grow flex overflow-hidden">
                {fileTree[currentFile] && (
                  <div className="flex-grow p-3 bg-white dark:bg-gray-900 overflow-auto">
                    <SyntaxHighlighter
                      language="javascript"
                      style={oneDark}
                      customStyle={{
                        padding: "1rem",
                        minHeight: "100%",
                        outline: "none",
                        whiteSpace: "pre-wrap",
                        borderRadius: "0.5rem",
                      }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedContent = e.target.innerText;
                        setFileTree((prev) => ({
                          ...prev,
                          [currentFile]: {
                            file: { contents: updatedContent },
                          },
                        }));
                      }}
                    >
                      {fileTree[currentFile]?.file?.contents ||
                        "// No content available"}
                    </SyntaxHighlighter>
                  </div>
                )}

                {IframeUrl && webContainer && (
                  <div className="w-full md:w-[400px] min-w-[320px] border-t md:border-t-0 md:border-l dark:border-gray-700 flex flex-col">
                    <div className="address-bar p-2 bg-slate-100 dark:bg-gray-800 border-b dark:border-gray-700">
                      <input
                        type="text"
                        value={IframeUrl}
                        onChange={(e) => setIframeUrl(e.target.value)}
                        className="w-full px-3 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-sm"
                      />
                    </div>
                    <iframe
                      src={IframeUrl}
                      className="flex-grow w-full bg-gray-200 dark:bg-gray-300"
                      title="Preview"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Open Right Section Button */}
      {fileTree && !rightSection && (
        <div
          className="fixed  bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded shadow-md cursor-pointer z-50"
          onClick={() => setRightSection(!rightSection)}
        >
          <p>Open File Box</p>
        </div>
      )}

      {/* Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Select Users
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    selectedUsers.includes(user.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <span>{user.name}</span>
                  {selectedUsers.includes(user.id) && (
                    <i className="ri-check-line text-xl"></i>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                onClick={handleAddCollaborators}
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Users List */}
      {isOpen && !rightSection && (
        <div className="absolute top-16 right-4 z-30 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="ri-team-fill text-blue-500"></i>
            Project Members
          </h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {projectUsers.length === 0 ? (
              <li className="text-gray-500 dark:text-gray-400 text-sm">
                No members yet.
              </li>
            ) : (
              projectUsers.map((u) => (
                <li
                  key={u.id || u._id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {u.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {u.name}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </main>
  );
};

export default ProjectSidebar;