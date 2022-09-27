const base64prefix = 'data: image/png;base64,'

export default async function img2base(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return base64prefix + reader.result.replace(/^data:.+;base64,/, '')
}