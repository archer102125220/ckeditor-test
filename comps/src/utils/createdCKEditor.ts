export function importCKEditor(div: HTMLDivElement, config: any = {}): Promise<any> {
  if (div === null || div === undefined) throw new Error('HTMLDivElement is null');
  if (document.querySelector('script[src="./comps/ckeditor/ckeditor.js"],#ckEditor-script') === null) {
    const script = document.createElement('script');
    script.src = './comps/ckeditor/ckeditor.js';
    script.id = 'ckEditor-script';
    document.head.appendChild(script);
  }
  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve(await createdCKEditor(div, config));
    }, 20);
  });
}

export function createdCKEditor(div: HTMLDivElement, config: any = {}): Promise<any> {
  if (div === null || div === undefined) throw new Error('HTMLDivElement is null');
  return new Promise(async (resolve) => {
    // @ts-ignore
    const ClassicEditor: any = window.ClassicEditor || null;
    if (typeof ClassicEditor?.create === 'function') {
      resolve(await ClassicEditor.create(div, config));
    } else {
      setTimeout(async () => {
        resolve(await createdCKEditor(div, config));
      }, 20);
    }
  });
}