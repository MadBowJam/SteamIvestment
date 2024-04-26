import React from "react";

Object.entries(images).map(([key, imagePath]) => {
  const imageNameFromKey = key.substring(2, key.length - 4);
  if (imageNameFromKey === `${item.tournament}-${item.name}`) {
    return <img key={imageNameFromKey} src={imagePath} alt={imageNameFromKey} />;
  } else {
    return null; // Або виконайте інші дії, якщо ключ не відповідає умові
  }
});