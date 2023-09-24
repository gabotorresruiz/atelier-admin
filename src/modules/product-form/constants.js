const convertToBase64 = image =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onload = () => {
      let aux = [];
      const base64 = reader.result;
      aux = base64.split(',');
      resolve(aux[1]);
    };

    reader.onerror = e => reject(e);
  });

export default convertToBase64;
