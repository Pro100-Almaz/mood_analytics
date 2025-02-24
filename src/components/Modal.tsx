import { motion } from "framer-motion";
import React, { useState, useRef } from "react";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    if (username === "admin" && password === "qwerty123") {
      setIsAuthenticated(true);
    } else {
      alert("Неверные учетные данные");
    }
  };
  const handleClose = () => {
    setIsAuthenticated(false);
    onClose();
  };
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await fetch("https://your-upload-endpoint.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      console.log("Upload successful:", result);
      alert("Файл загружен успешно");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Ошибка загрузки файла");
    } finally {
      setUploading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      {!isAuthenticated ? (
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg z-30">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              ✖
            </button>
          </div>
          <div className="text-center py-4 mx-4">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Авторизация</h2>
            <input
              type="text"
              placeholder="Логин"
              className="border border-gray-300 px-4 py-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              className="border border-gray-300 px-4 py-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <motion.button
              className="px-5 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-300 shadow-md w-full"
              onClick={handleLogin}
            >
              Войти
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg z-30">
          <div className="flex justify-end">
            <button onClick={handleClose} className="text-red-500">
                ✖
            </button>
          </div>
          <h2 className="text-2xl font-light text-gray-800 mb-3">
            Если у вас есть файл или документ, вы можете загрузить его в базу
          </h2>
          <p>
            Загрузка файлов на сайты нужна для различных целей, в зависимости от
            типа ресурса и его функционала. Вот основные задачи, которые решает
            загрузка файлов: Передача данных – пользователи могут загружать
            документы, изображения, видео и другие файлы для обмена информацией.
            Персонализация – возможность загружать аватары, обложки профилей,
            фоновые изображения и другие файлы для кастомизации аккаунта. Работа
            с документами – загрузка файлов позволяет отправлять резюме, отчёты,
            заполненные формы и другие важные документы. Медиа-контент –
            загрузка изображений, аудио и видео важна для соцсетей, блогов,
            новостных порталов и стриминговых платформ. Облачное хранилище –
            пользователи могут загружать файлы для хранения и последующего
            скачивания (Google Drive, Dropbox и др.). Формы обратной связи –
            загрузка файлов используется в контактных формах, например, для
            отправки скриншотов при обращении в техподдержку. Загрузка программ
            и обновлений – пользователи могут загружать файлы для установки ПО,
            обновлений, драйверов и других технических данных. Обмен контентом –
            возможность загружать и делиться файлами на форумах, образовательных
            платформах и внутри командных проектов. Загрузка файлов делает сайты
            более функциональными и удобными, расширяя их возможности и повышая
            уровень взаимодействия с пользователями.
          </p>
          <motion.button
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Загрузка..." : "Загрузить дайджест"}
          </motion.button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
          />
        </div>
      )}
    </div>
  ) : null;
}
