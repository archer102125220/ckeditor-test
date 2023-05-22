import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import dayjs from 'dayjs';

import { importCKEditor } from './../../utils/createdCKEditor';
import { UploadAdapter } from './../utils/UploadAdapter';

import '../../style/button.css';

const isDev = process.env.NODE_ENV === 'development';

const IMG_UPLOAD: string = isDev ? ' http://localhost:2000/upload-img' : '/app_api/blog_image_upload.php';

const POST_URL: string = '/';

export default () => {
  const [CKEditor, setCKEditor] = useState(null);
  const [categoryList, setCategoryList] = useState<Array<any>>([{ mid: 'test', mname: '測試' }]);
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [contextErrorMsg, setContextErrorMsg] = useState('');
  const [articleVisible, setArticleVisible] = useState({ status: true, message: "上架" });
  const [keyWord, setKeyWord] = useState('');
  const [keyWordError, setKeyWordError] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startDateError, setStartDateError] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [endDateError, setEndDateError] = useState(false);
  const [dateErrorMsg, setDateErrorMsg] = useState('');

  const CKEditorRef = useRef<any>(null);

  useEffect(() => {
    createdCKEditor();
    (async () => {
      try {
        const { data } = await axios.get('/specialevent/configs/main_market_mapping.json');
        const _categoryList: Array<any> = data;
        setCategoryList(_categoryList);
      } catch (error) {
        console.log(error);
      }
    })();
    handleDescriptionChange(context);
  }, []);
  useEffect(() => {
    handleDescriptionChange(context);
  }, [context]);
  useEffect(() => {
    dataTimeCheck(startDate, endDate);
  }, [articleVisible]);

  async function createdCKEditor() {
    try {
      const _CKEditor = await importCKEditor(CKEditorRef.current, {
        initialData: context,
        language: 'zh',
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'imageUpload',
            'mediaEmbed',
            'fontSize',
            'fontBackgroundColor',
            'fontColor',
            'fontFamily'
          ]
        },
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph'
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1'
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2'
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3'
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4'
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5'
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6'
            }
          ]
        }
      });
      _CKEditor.model.document.on('change:data', () => handleContextChange(_CKEditor));
      _CKEditor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new UploadAdapter(loader, IMG_UPLOAD);
      };
      setCKEditor(_CKEditor);
    } catch (error) {
      console.log(error);
    }
  }

  const _switchVisible = (e: any) => {
    if (e.target.checked) {
      setArticleVisible({ status: true, message: "上架" });
    } else {
      setArticleVisible({ status: false, message: "下架" });
    }
  };

  function handleCategoryChange(newCategory: string) {
    setCategory(newCategory);
    setCategoryError(false);
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setTitleError(false);
  }

  function handleContextChange(editor: any) {
    if (typeof editor?.getData === 'function') {
      const data = editor.getData();
      setContext(data);
      // console.log({ event: { ...event }, editor: { ...editor } });
    }
  }

  function handleDescriptionChange(newContext: string) {
    const div = document.createElement('div');
    div.innerHTML = newContext;

    if (div.querySelector('img') !== null) {
      setContextErrorMsg('');
    }

    const _description = getDescription(div, 'p') || getDescription(div, 'h1,h2,h3,h4,h5,h6');

    if (_description.trim() !== '') {
      setDescription(_description.substring(0, 75));
    }
  }
  function getDescription(div: HTMLDivElement, query: string): string {
    let _description = '';
    const descriptionElementList: NodeListOf<HTMLParagraphElement> = div.querySelectorAll(query);
    if (descriptionElementList.length === 0) return _description;

    for (let i = 0; i <= descriptionElementList.length; i++) {
      const descriptionElement: HTMLParagraphElement = descriptionElementList[i];
      if (descriptionElement?.innerText && descriptionElement.innerText.trim() !== '') {
        _description = descriptionElement.innerText;
        break;
      }
    }
    return _description;
  }


  function handleKeyWordChange(newKeyWord: string) {
    setKeyWord(newKeyWord);
    setKeyWordError(false);
  }

  function handleStartDateChange(newStartDate: string) {
    setStartDate(newStartDate);
    setStartDateError(false);
    dataTimeCheck(newStartDate, endDate);
  }

  function handleEndDateChange(newEndDate: string) {
    setEndDate(newEndDate);
    setEndDateError(false);
    dataTimeCheck(startDate, newEndDate);
  }

  function dataTimeCheck(_startDate: string, _endDate: string) {
    if (_startDate !== '' && _endDate !== '') {
      const startDateObj = new Date(_startDate);
      const endDateObj = new Date(_endDate);
      let _dateErrorMsg = '';
      // console.log({ startDateObj: startDateObj.getTime(), endDateObj: endDateObj.getTime() });
      if (startDateObj.getTime() > endDateObj.getTime()) {
        setStartDateError(true);
        setEndDateError(true);

        _dateErrorMsg = '請檢查上架開始及結束時間';
        setDateErrorMsg(_dateErrorMsg);
        return false;
      }

      if (startDateError === true) {
        setStartDateError(false);
      }
      if (endDateError === true) {
        setEndDateError(false);
      }
      if (dateErrorMsg !== '') {
        setDateErrorMsg('');
      }
    }
    return true;
  }

  async function handleSubmit() {

    const field: Array<string | boolean> = [category, title, keyWord, startDate, endDate];
    const errorFieldSetter = [setCategoryError, setTitleError, setKeyWordError, setStartDateError, setEndDateError];

    const fail = field.filter((element: any, index: number) => {
      if (element === '') {
        if (typeof errorFieldSetter[index] === 'function') {
          errorFieldSetter[index](true);
        }
        return true;
      }
      return false;
    });
    let _contextErrorMsg = '';
    if (context === '') {
      _contextErrorMsg += '請輸入文字';
      fail.push(true);
    }

    const div = document.createElement('div');
    div.innerHTML = context;

    const img = div.querySelector('img');
    let firstImage = '';
    if (img === null) {
      _contextErrorMsg += (_contextErrorMsg !== '' ? '；' : '') + '請插入圖片，以利建立文章縮圖';
      fail.push(true);
    } else {
      firstImage = img.src;
    }
    if (dataTimeCheck(startDate, endDate) === false) {
      fail.push(true);
    }

    if (_contextErrorMsg !== '') {
      setContextErrorMsg(_contextErrorMsg);
    }

    if (fail.length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("context", context);
    formData.append("visible", `${articleVisible.status}`);
    formData.append("keyWord", keyWord);
    formData.append("firstImage", firstImage);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    console.log(formData, {
      category,
      title,
      // 第一個P
      description,
      context,
      visible: articleVisible.status,
      keyWord,
      // 第一張圖的url
      firstImage,
      // 今天之前的時間不能選
      startDate,
      endDate
    });
    console.log(formData);

    try {
      await axios.post(
        POST_URL,
        {
          category,
          title,
          // 第一個P
          description,
          context,
          visible: articleVisible.status,
          keyWord,
          // 第一張圖的url
          firstImage,
          // 今天之前的時間不能選
          startDate,
          endDate
        },
        // formData,
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
      );
    } catch (error) {
      console.log('post error');
    }
  }

  function handleReset() {
    setCategory('');
    setCategoryError(false);
    setTitle('');
    setTitleError(false);
    setDescription('');
    setContext('');
    setArticleVisible({ status: true, message: "上架" });
    setKeyWord('');
    setKeyWordError(false);
    setStartDate('');
    setStartDateError(false);
    setEndDate('');
    setEndDateError(false);
    setDateErrorMsg('');
    setContextErrorMsg('');
    console.log(CKEditor);
    if (typeof CKEditor?.setData === 'function') {
      CKEditor.setData('');
    }
  }

  return (
    <div
      className="m-3"
    // style={{ minWidth: 1200 }}
    >
      <div className="mb-3">
        <label className="form-label">文章類別</label>
        <select
          className={["form-select", categoryError ? 'is-invalid' : ''].join(' ')}
          onChange={e => handleCategoryChange(e.target.value)}
          value={category}
        >
          <option value=''>請選擇</option>
          {
            categoryList.map((_category, index) => (
              <option key={index} value={_category.mid}>
                {_category.mname}
              </option>
            ))
          }
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">文章標題</label>
        <input
          type="text"
          className={["form-control", titleError ? 'is-invalid' : ''].join(' ')}
          onChange={e => handleTitleChange(e.target.value)}
          value={title}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">文章內文</label>
        <div
          style={
            contextErrorMsg !== '' ?
              // @ts-ignore
              { '--ck-color-base-border': '#dc3545', '--ck-color-toolbar-border': '#dc3545' } :
              {}
          }>
          <div ref={CKEditorRef} />
        </div>
        <div className="invalid-feedback" style={contextErrorMsg !== '' ? { display: 'block' } : {}}>
          {contextErrorMsg}
        </div>
      </div>

      {/* <div className="mb-3">
        <label className="form-label">文章描述(自動節錄文章內文內容，最多75字)</label> */}
      {/* <dd className="col-sm-9">{description}</dd> */}
      {/* <input
          type="text"
          // readOnly={true}
          value={description}
          onChange={e => setDescription(`${e.target.value}`.substring(0, 75))}
          className={["form-control", keyWordError ? 'is-invalid' : ''].join(' ')}
        />
      </div> */}

      <div className="mb-3">
        <label className="form-label">文章關鍵字</label>
        <input
          type="text"
          value={keyWord}
          onChange={e => handleKeyWordChange(e.target.value)}
          className={["form-control", keyWordError ? 'is-invalid' : ''].join(' ')}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">文章狀態</label>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" onChange={_switchVisible} checked={articleVisible?.status} />
          <label className="form-check-label">{articleVisible?.message}</label>
        </div>
      </div>
      <div className="mb-3" style={{ minHeight: '6.25em' }}>
        <label className="form-label">上架時間</label>
        <div className="row g-3">
          <div className="col-auto" style={{ width: '10.625em' }}>
            <input
              type="date"
              value={startDate}
              min={dayjs().format('YYYY-MM-DD')}
              max={endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}
              onChange={e => handleStartDateChange(e.target.value)}
              className={["form-control", startDateError ? 'is-invalid' : ''].join(' ')}
            />
          </div>
          <div className="col-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            ~
          </div>
          <div className="col-auto" style={{ width: '10.625em' }}>
            <input
              type="date"
              value={endDate}
              min={startDate ? dayjs(startDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')}
              onChange={e => handleEndDateChange(e.target.value)}
              className={["form-control", endDateError ? 'is-invalid' : ''].join(' ')}
            />
          </div>
        </div>
        <div className="invalid-feedback" style={(endDateError || startDateError) ? { display: 'block' } : {}}>
          {dateErrorMsg}
        </div>
      </div>
      <div className="d-flex">
        <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={handleSubmit}>發布文章</button>
        <button className="btn btn-danger" onClick={handleReset}>重新填寫</button>
      </div>
    </div>
  )
}