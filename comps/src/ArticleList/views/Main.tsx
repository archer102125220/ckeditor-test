import { useState, useEffect } from "react";
import styled from '@emotion/styled';
import axios from 'axios';
import dayjs from 'dayjs';

import '../../style/button.css';

const fakeArticleList = [
  {
    img: 'https://dulu5budzucsb.cloudfront.net/upload/202305/1684140725_1463971684552.jpg',
    title: '測試文章標題',
    description: '測試文章摘要',
    visible: false,
    url: '#'
  },
  {
    img: 'https://dulu5budzucsb.cloudfront.net/upload/202305/1684136610_FB_IMG_1549359448117.jpg',
    title: '文章標題',
    description: '文章摘要',
    visible: true,
    url: '#'
  }
];
for (let i = 1; i <= 200; i++) {
  if (i % 2 === 0) {
    fakeArticleList.push({
      ...fakeArticleList[1],
      title: i + fakeArticleList[1].title,
      description: i + fakeArticleList[1].description
    });
  } else {
    fakeArticleList.push({
      ...fakeArticleList[0],
      title: i + fakeArticleList[0].title,
      description: i + fakeArticleList[0].description
    });
  }
}

const ARTICLE_TITLE = {
  img: '文章縮圖',
  title: '文章標題',
  description: '文章摘要',
  visible: '文章狀態',
  url: '操作'
};

const PAGE_STEP = 13;

const RootDiv = styled.div`
  width: 90%;
  margin: auto;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 10px);
`;
const InputRowDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  @media (max-width: 768px) {
    display: block;
  }
`;
const InputFieldDiv = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;
const ArticleLabel = styled.label`
  flex-shrink: 0;
`;
const CategorySelect = styled.select`
  width: unset;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Input = styled.input`
  flex: 1;
`;
const DataTitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px #cccccc solid;
  padding-top: 5px;
  padding-bottom: 5px;
  @media (max-width: 768px) {
    display: none;
  }
`;
const DataTitleContextSpan = styled.span`
  flex:1;
`;
const DataRowDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border-style: solid;
  border-color: #cccccc ;
  border-bottom-width: 2px;
  padding: 10px;
  padding-bottom: 5px;
  &:nth-child(odd){
    background-color: #fff4b9;
  }
  &:nth-child(even){
    background-color: #fffcee;
  }
  &:hover {
    background-color: #ffda45;
  }
  @media (max-width: 768px) {
    display: block;
    border-bottom-width: 0px;
    border-width: 1px;
    border-radius: 4px;
    margin-top: 10px;
    margin-bottom: 5px;
    padding: 8px;
    &:hover {
      &:nth-child(odd){
        background-color: #fff4b9;
      }
      &:nth-child(even){
        background-color: #fffcee;
      }
    }
  }
`;
const DataRowTitleSpan = styled.span`
  display: none;
  min-width: 22vw;
  @media (max-width: 768px) {
    display: block;
  }
`;
const DataRowFieldSpan = styled.span`
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    justify-content: unset;
  }
`;
const DataRowImg = styled.img`
  object-fit: contain;
  width: 100px;
  height: 100px;
  @media (max-width: 768px) {
    width: unset;
  }
`;
const DataFieldDiv = styled.div`
  @media (max-width: 768px) {
    margin-left: 15%;
  }
`;
const DateBlockDiv = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: unset;
    flex-wrap: wrap;
  }
`;
const DateBlockBetweenDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  @media (max-width: 768px) {
    flex: unset;
    padding: 0px;
  }
`;
const HeaderDiv = styled.div`
  min-height: 10vh;
`;
const ContextDiv = styled.div`
  flex: 1;
  overflow: auto;
`;
const FooterDiv = styled.div`
  min-height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px #cccccc solid;
`;
const PageSeletor = styled.select`
  width: unset;
`;
const PageStepInput = styled.input`
  width: 80px;
`;

export default () => {
  const [articleList, setArticleList] = useState<typeof fakeArticleList>([]);
  const [categoryList, setCategoryList] = useState<Array<any>>([{ mid: 'test', mname: '測試' }]);
  const [category, setCategory] = useState('');
  const [articleSreach, setArticleSreach] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [visible, setVisible] = useState(true);
  const [totalPage, setTotalPage] = useState([1]);
  const [page, setPage] = useState(1);
  const [pageStep, setPageStep] = useState(PAGE_STEP);

  useEffect(() => {
    GET_MainMarketMapping();
    GET_ArticleList();
  }, []);

  async function GET_MainMarketMapping() {
    try {
      const { data } = await axios.get('/specialevent/configs/main_market_mapping.json');
      const _categoryList: Array<any> = data;
      setCategoryList(_categoryList);
    } catch (error) {
      console.log(error);
    }
  }

  async function GET_ArticleList(payload?: any) {
    // try {
    //   const { data } = await axios.get('/article/list', payload);
    //   const _articleList: Array<any> = data;
    const { data } = { data: fakeArticleList };
    const _articleList: Array<any> = data;
    handleTotalPage(pageStep, _articleList);
    setArticleList(_articleList);
    // } catch (error) {
    //   console.log(error);
    //   setArticleList(fakeArticleList);
    // }
  }
  function handleTotalPage(_pageStep = pageStep, _articleList: Array<any> = articleList) {
    const totalPageArray: Array<any> = [];
    let _totalPage = _articleList.length / _pageStep;
    if (_articleList.length % _pageStep > 0) {
      _totalPage += 1;
    }
    for (let i = 1; i <= _totalPage; i++) {
      totalPageArray.push(i);
    }
    if (page > _totalPage) {
      setPage(1);
    }
    setTotalPage(totalPageArray);
  }

  function handleSwitchVisible(e: any) {
    const _visible = e.target.checked;
    setVisible(_visible);
    handleSreach(_visible);
  }

  function handleSreach(_visible = visible) {
    let payload: any = { visible: _visible };

    if (category !== '') {
      payload = {
        ...payload,
        category
      }
    }

    if (articleSreach !== '') {
      payload = {
        ...payload,
        articleSreach
      }
    }

    if (dateStart !== '') {
      payload = {
        ...payload,
        dateStart
      }
    }

    if (dateEnd !== '') {
      payload = {
        ...payload,
        dateEnd
      }
    }

    console.log(payload);

    GET_ArticleList(payload);
  }

  function handlPageStep(newPageStep: any) {
    if (isNaN(newPageStep) === false && Number(newPageStep) > 0) {
      handleTotalPage(newPageStep);
      setPageStep(newPageStep);
    }
  }

  return (
    <RootDiv>
      <HeaderDiv>
        <InputRowDiv>
          <InputFieldDiv>
            <ArticleLabel>文章類別：</ArticleLabel>
            <CategorySelect
              value={category}
              className="form-select"
              onChange={e => setCategory(e.target.value)}
            >
              <option value=''>請選擇</option>
              {
                categoryList.map((_category, index) => (
                  <option key={index} value={_category.mid}>
                    {_category.mname}
                  </option>
                ))
              }
            </CategorySelect>
          </InputFieldDiv>
          <InputFieldDiv>
            <ArticleLabel>文章搜尋：</ArticleLabel>
            <Input
              value={articleSreach}
              className="form-control"
              onChange={(e) => setArticleSreach(e.target.value)}
            />
          </InputFieldDiv>
          <InputFieldDiv>
            <ArticleLabel>文章日期：</ArticleLabel>
            <DateBlockDiv>
              <Input
                type="date"
                value={dateStart}
                className="form-control"
                max={dateEnd ? dayjs(dateEnd).format('YYYY-MM-DD') : ''}
                onChange={(e) => setDateStart(e.target.value)}
              />
              <DateBlockBetweenDiv className="col-auto">
                ~
              </DateBlockBetweenDiv>
              <Input
                type="date"
                value={dateEnd}
                className="form-control"
                min={dateStart ? dayjs(dateStart).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')}
                onChange={e => setDateEnd(e.target.value)}
              />
            </DateBlockDiv>
          </InputFieldDiv>
          <InputFieldDiv>
            <ArticleLabel>文章狀態：</ArticleLabel>
            <div className="form-check form-switch">
              <ArticleLabel className="form-check-ArticleLabel">
                <input
                  role="switch"
                  type="checkbox"
                  className="form-check-input"
                  onChange={handleSwitchVisible}
                  checked={visible}
                />
                {visible === true ? '上架' : '下架'}
              </ArticleLabel>
            </div>
          </InputFieldDiv>
          <button className="btn btn-primary" onClick={() => handleSreach()}>文章查詢</button>
        </InputRowDiv>
        <DataTitleDiv>
          <DataTitleContextSpan>{ARTICLE_TITLE.img}</DataTitleContextSpan>
          <DataTitleContextSpan>{ARTICLE_TITLE.title}</DataTitleContextSpan>
          <DataTitleContextSpan>{ARTICLE_TITLE.description}</DataTitleContextSpan>
          <DataTitleContextSpan>{ARTICLE_TITLE.visible}</DataTitleContextSpan>
          <DataTitleContextSpan>{ARTICLE_TITLE.url}</DataTitleContextSpan>
        </DataTitleDiv>
      </HeaderDiv>
      <ContextDiv>
        {
          articleList.slice((page - 1) * pageStep, ((page - 1) * pageStep + pageStep)).map((article: typeof fakeArticleList[0], index: number) => (
            <DataRowDiv key={index}>
              <DataRowFieldSpan>
                <DataRowTitleSpan>{ARTICLE_TITLE.img}：</DataRowTitleSpan>
                <DataFieldDiv>
                  <DataRowImg src={article.img} />
                </DataFieldDiv>
              </DataRowFieldSpan>
              <DataRowFieldSpan>
                <DataRowTitleSpan>{ARTICLE_TITLE.title}：</DataRowTitleSpan>
                <DataFieldDiv>{article.title}</DataFieldDiv>
              </DataRowFieldSpan>
              <DataRowFieldSpan>
                <DataRowTitleSpan>{ARTICLE_TITLE.description}：</DataRowTitleSpan>
                <DataFieldDiv>{article.description}</DataFieldDiv>
              </DataRowFieldSpan>
              <DataRowFieldSpan>
                <DataRowTitleSpan>{ARTICLE_TITLE.visible}：</DataRowTitleSpan>
                <DataFieldDiv>{article.visible ? '上架' : '下架'}</DataFieldDiv>
              </DataRowFieldSpan>
              <DataRowFieldSpan>
                <DataRowTitleSpan>{ARTICLE_TITLE.url}：</DataRowTitleSpan>
                <DataFieldDiv>
                  <a className="btn btn-primary" href={article.url}>查看文章</a>
                </DataFieldDiv>
              </DataRowFieldSpan>
            </DataRowDiv>
          ))
        }
      </ContextDiv>
      <FooterDiv>
        <label>第</label>
        <PageSeletor className="form-select" value={page} onChange={(e) => setPage(Number(e.target.value))}>
          {
            totalPage.map((_page: any, index: number) => (
              <option value={_page} key={index}>{_page}</option>
            ))
          }
        </PageSeletor>
        <label>頁</label>
        <label>，單頁</label>
        <PageStepInput
          value={pageStep}
          className="form-control"
          onChange={(e) => handlPageStep(e.target.value)}
        />
        <label>筆</label>
      </FooterDiv>
    </RootDiv>
  )
}