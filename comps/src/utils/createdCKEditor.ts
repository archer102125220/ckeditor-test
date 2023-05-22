export function importCKEditor(div: HTMLDivElement, config: any = {}): Promise<any> {
  if (div === null || div === undefined) throw new Error('HTMLDivElement is null or undefined');
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
  if (div === null || div === undefined) throw new Error('HTMLDivElement is null or undefined');
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

// https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/upload-adapter.html#implementing-a-custom-upload-adapter
export class UploadAdapter {
  loader: any;
  xhr: any;
  postUrl: string;
  constructor(loader: any, postUrl:string) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    // The file loader instance to use during the upload.
    this.postUrl = postUrl;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then((file: any) => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }
  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();

    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open('POST', this.postUrl, true);
    xhr.responseType = 'json';
  }
  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve: any, reject: any, file: any) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve({
        default: response.url
      });
    });

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt: any) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }
  // Prepares the data and sends the request.
  _sendRequest(file: any) {
    // Prepare the form data.
    const data = new FormData();

    data.append('upload', file);

    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.

    // Send the request.
    this.xhr.send(data);
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}