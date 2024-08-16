import React, { useState } from 'react';
import './Selector.css';

function Selector() {
    const [image, setImage] = useState(null);
    const [boxes, setBoxes] = useState([]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setImage(file);

        const data = new FormData();
        data.append("image_file", file);

        try {
            const response = await fetch("http://localhost:8080/detect", {  // Cập nhật URL ở đây
                method: "POST",
                body: data
            });
            const result = await response.json();
            console.log("Boxes received:", result);
            setBoxes(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const drawImageAndBoxes = () => {
        if (!image) return;

        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(image);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 3;
            ctx.font = "18px serif";

            boxes.forEach(([x1, y1, x2, y2, label, prob]) => {
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                ctx.fillStyle = "#00ff00";
                const width = ctx.measureText(`${label} (${prob})`).width;
                ctx.fillRect(x1, y1, width + 10, 25);
                ctx.fillStyle = "#000000";
                ctx.fillText(`${label} (${prob})`, x1, y1 + 18);
            });
        };
    };

    return (
        <div className="container">
            <label className="file-label">
                <input type="file" className="file-input" onChange={handleFileChange} />
                Load Model
            </label>
            <div className="canvas-container">
                <canvas></canvas>
                {drawImageAndBoxes()}
            </div>
        </div>
    );
}

export default Selector;
