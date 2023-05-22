import { useState, useEffect, useRef } from "react";
import styled from '@emotion/styled';
import axios from 'axios';

import '../style/article_detail.css';

import { importCKEditor } from './../../utils/createdCKEditor';

const RootDiv = styled.div`
  width: 90%;
  margin: auto;
  margin-top: 10px;
`;
const RowDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
`;

const fakeContext = `<h1>內文：標題1</h1><h2>內文：標題2</h2><h3>內文：標題3</h3><h4>內文：標題4</h4><h5>內文：標題5</h5><h6>內文：標題6</h6><p>內文：段落</p><p><strong>內文：B</strong></p><p><i>內文：I</i></p><p><a href="#">內文：超連結</a></p><p><span class="text-tiny">內文：特小</span></p><p><span class="text-small">內文：小</span></p><p>內文：預設大小</p><p><span class="text-big">內文：大</span></p><p><span class="text-huge">內文：特大</span></p><figure class="image image-style-side image_resized" style="width:43.37%;"><img src="https://dulu5budzucsb.cloudfront.net/upload/202305/1684136610_FB_IMG_1549359448117.jpg"></figure><p><span style="color:hsl(0, 75%, 60%);">內文：顏色</span></p><p><span style="background-color:hsl(90, 75%, 60%);">內文：文字底色</span></p><p><strong>內</strong><i>文</i><span style="background-color:hsl(180, 75%, 60%);">：</span><span style="color:hsl(270, 75%, 60%);">混</span><span class="text-big">合</span></p><p>&nbsp;</p><p>&nbsp;</p><p><img class="image_resized" style="width:45.17%;" src="https://dulu5budzucsb.cloudfront.net/upload/202305/1684140725_1463971684552.jpg"></p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><figure class="media"><oembed url="https://youtu.be/hTncOZxV6Wc"></oembed></figure><p>&nbsp;</p><p>&nbsp;</p>`;

function ArticleDetail() {
  const [cntextViewer, setContextViewer] = useState(null);
  const [title, setTitle] = useState('測試文章標題');
  const [context, setContext] = useState('');
  const [h1Title, setH1Title] = useState('');
  const [h2Title, setH2Title] = useState('');
  const [description, setDescription] = useState('');

  const CKEditorRef = useRef<any>(null);

  useEffect(() => {
    GET_ArticleDetail();
    // 因為插入影片的顯示需要額外的js處理，所以透過禁止編輯的CKEditor來做內文渲染
    createdContextViewer();
  }, []);
  useEffect(() => {
    if (typeof cntextViewer?.setData === 'function') {
      cntextViewer.setData(context);
    }
  }, [cntextViewer, context]);

  async function createdContextViewer() {
    try {
      const CKEditor = await importCKEditor(CKEditorRef.current, {
        toolbar: [],
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
      CKEditor.enableReadOnlyMode(CKEditor.id);
      setContextViewer(CKEditor);
    } catch (error) {
      console.log(error);
    }
  }

  async function GET_ArticleDetail(payload?: any) {
    // try {
    const { data } = { data: fakeContext };
    //   const { data } = await axios.get('/article/detail', payload);
    setTitle('測試文章標題');
    setContext(data);
    const div = document.createElement('div');
    div.innerHTML = fakeContext;
    if (div.querySelector('p') !== null) {
      setDescription(div.querySelector('p').innerText);
    }
    if (div.querySelector('h1') !== null) {
      setH1Title(div.querySelector('h1').innerText);
    }
    if (div.querySelector('h2') !== null) {
      setH2Title(div.querySelector('h2').innerText);
    }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  return <RootDiv>
    <RowDiv className="mb-3">
      {/* <label>文章標題： </label> */}
      <p>{title}</p>
    </RowDiv>
    <RowDiv>
      <h1>H1 標題：</h1>
      <h1>{h1Title}</h1>
    </RowDiv>
    <RowDiv>
      <h2>H2 標題：</h2>
      <h2>{h2Title}</h2>
    </RowDiv>
    <RowDiv>
      <label>Meta Description： </label>
      <p>{description}</p>
    </RowDiv>
    <div style={
      {
        // @ts-ignore 
        '--ck-color-base-border': '#ccced100',
        '--ck-color-toolbar-border': '#ccced100',
        '--ck-inner-shadow': '0',
        '--ck-focus-ring': '0'
      }
    }>
      <label>文章內文： </label>
      <div ref={CKEditorRef} />
    </div>
  </RootDiv>;
}

export default ArticleDetail;