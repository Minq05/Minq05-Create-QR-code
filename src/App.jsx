import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

function App() {
  const [text, setText] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(200);
  const [history, setHistory] = useState([]);
  const qrRef = useRef();

  const generateQRCode = () => {
    if (text.trim() === "") return;

    // Lưu lịch sử mã QR
    setHistory((prev) => [
      { text, fgColor, bgColor, size, id: Date.now() },
      ...prev.slice(0, 4), // Giới hạn tối đa 5 mục trong lịch sử
    ]);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage:
          "url('https://img3.thuthuatphanmem.vn/uploads/2019/10/10/anh-background-dong-don-gian_032845592.gif')",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-1 left-0">
          <img
            src="https://s3-alpha-sig.figma.com/img/6c97/ed47/76b8c84d7f330ed6b4d524c5013d50f1?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=X52fezzW6ji~1DUtYxwV0rAUxakZxz~iYtSSWRSVqpCAJbvu--7Tol7ioWQfGg6R4uLbe5IqctXxlh4QranRu6OeNXxsCiEex8Ms5sMx0XV-v-~fUZOQmyA72ZML4IVaiMV56vMX08Pg5z2W5TysCsL9YlNVPgUi04xR1my2HTmrKedahqakoO0AyEv59BetfKm3TE95cXv3237u70DZP-L~oiV8tZmS5aG6olY8v88O5YXkZzaGD5mqCxAvqBaYrl9~vtJctR04mpA9JZh4kaNROp9EMv~BnNpOplKMlPohKuLMmZdaz6k6O4lR-7N6F9mVrBlwoq3M0SGpOpmBVw__"
            className="w-56 h-auto"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-6">
            QR Code Generator
          </h1>
          <input
            type="text"
            placeholder="Enter content..."
            className="border p-3 rounded-md mb-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-center space-x-4 mb-4">
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
              <label className="mb-2 font-bold">Foreground Color</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div
                className="w-10 h-10 mt-2 rounded-full border"
                style={{ backgroundColor: fgColor }}
              ></div>
            </div>
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
              <label className="mb-2 font-bold">Background Color</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div
                className="w-10 h-10 mt-2 rounded-full border"
                style={{ backgroundColor: bgColor }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center mb-4">
            <label className="mb-2 font-bold">QR Code Size: {size}px</label>
            <input
              type="range"
              min="100"
              max="400"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={generateQRCode}
            className="w-full bg-green-500 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Create QR Code
          </button>
          <div ref={qrRef} className="flex justify-center p-4">
            {text && (
              <QRCodeCanvas
                value={text}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
              />
            )}
          </div>
          {text && (
            <button
              onClick={downloadQRCode}
              className="w-full mt-4 bg-purple-500 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Download QR Code
            </button>
          )}
        </div>

        {/* Lịch sử mã QR */}
        {history.length > 0 && (
          <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              QR Code History
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-100 p-2 rounded-lg shadow-md flex flex-col items-center transform hover:scale-105 transition"
                >
                  <QRCodeCanvas
                    value={item.text}
                    size={80}
                    fgColor={item.fgColor}
                    bgColor={item.bgColor}
                  />
                  <p className="text-xs text-gray-700 mt-1 break-words text-center">
                    {item.text.length > 10
                      ? item.text.slice(0, 10) + "..."
                      : item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
