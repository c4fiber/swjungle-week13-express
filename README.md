# SW사관학교 정글7기 week13

나만의 무기 만들기 이전에 기술스택(express)을 공부하기 위한 리포지토리 입니다.

기간: 2023-10-31 ~ 2023-11-06

발표자료: https://docs.google.com/presentation/d/1dsxlSUGtTbB3zaoZUslxDPyzB5-f8MoMvkUEywTTE1k/edit#slide=id.g297f6b02e65_0_1

url: http://yousayrun.store

JSON formatter: https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa/related


```
// 게시물 등록
{
  "title": "[02] TOPGUN",
  "author": "c4fiber",
  "content": "You've been call back to TOPGUN",
  "password": 1234
}

// 게시물 등록 without 비밀번호
{
  "title": "testing 1231",
  "author": "c4fiber",
  "content": "good day to die!"
}

// 게시물 전부 조회

// 게시물 수정
{
  "title": "testing 111",
  "author": "c4fiber",
  "content": "testing 1 changed to testing 111",
  "password": 1234
}

// 게시물 삭제
{
  "password": "1234"
}

// 댓글 추가
{
  "post_id": "6545fab8fdb1adc038d97574",
  "author": "commenter 3",
  "content": "대충 응원한다는 이야기"
}

// 특정 게시물의 모든 comment 가져오기



```
