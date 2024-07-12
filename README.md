# buddypals

/ -> Home
/join -> Join
/login -> Login
/search -> Search user

/users/:id -> See user
/users/logout -> Log Out
/users/edit -> Edit my profile
/users/delete -> Delete my profile

/posts/:id -> See post
/posts/:id/edit -> Edit post
/posts/:id/delete -> Delete post
/posts/upload -> Upload post
/posts/comments -> Comment on a post

추가해야 하는 기능

1. 뒤로가기
2. 긴 글 포스트 더보기
3. 업로드 폼 개선: 프리뷰 지우면 폼에서 선택된 파일 삭제, 파일 선택 하지 않으면 핸들링
4. 댓글 삭제할 때 post, user 모델에서 해당 댓글 삭제

점검 필요한 기능

1. 미들웨어에서 유저 정보 받아오기(aws 포스트, 유저 이미지 저장 할 때 이름 부여해야 함)
2. s3Client로 데이터 삭제기능 구현
3. 리얼타임 댓글 구현
4. 댓글 입력 시 포스트 엘리먼트 위치 (top)값 변경 이슈
5. 포스트 모달 닫아도 스크롤 위치 유지
   ~~2. 카카오 로그인 점검~~
   ~~3. 새로고침 하면 not found 화면 생성 되는 이슈 점검~~
   ~~3. 포스트 수정, 업로드 기능 점검~~
