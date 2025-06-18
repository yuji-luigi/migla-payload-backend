export const jaCustomTranslations = {
  dashboard: {
    setup: 'セットアップ',
    please_initialize: 'ミグラダッシュボードを始めましょう。',
    initialize_basic_data: '基本データを設定するにはここから。',
    import_basic_data: 'エクセルを読み込む',
    classrooms_title: '教室の数は{{count}}です。',
    teachers_title: '先生の数は{{count}}です。',
    parents_title: '保護者の数は{{count}}です。',
    students_title: '学生の数は{{count}}です。',
    no_classrooms_title: '教室がまだ作成されていません。',
    no_teachers_title: '先生がまだ作成されていません。',
    no_parents_title: '保護者がまだ作成されていません。',
    no_students_title: '学生がまだ作成されていません。',
    create_classrooms: 'ファイルを読み込むか手動で教室を作成してください。',
    create_teachers: 'ファイルを読み込むか手動で先生を作成してください。',
    create_parents: 'ファイルを読み込むか手動で保護者を作成してください。',
    create_students: 'ファイルを読み込むか手動で学生を作成してください。',
    modal: {
      check_file: 'ファイルを確認してください。',
      import_classroom_heading: '教室を登録しましょう。',
      import_teachers_heading: '先生を登録しましょう。',
      import_users_heading: 'ユーザーを登録しましょう。',
      import_classroom_completed: '教室の登録が完了しました。',
      import_teachers_completed: '先生の登録が完了しました。',
      import_users_completed: 'ユーザーの登録が完了しました。',
    },
  },
  authentication: {
    ERROR_NO_ROLE: 'このユーザーにはアクセス権限がありません',
    'Login as': 'ログインするロールを選択',
    Admin: '管理者',
    Teacher: '先生',
    'If you are an admin': '管理者の場合はこちら',
    'If you are an teacher': '先生の場合はこちら',
    'If you are an': '{{role}}の場合はこちら',
  },
  button: {
    Import: 'ファイル読み込み',
    Close: '閉じる',
    Submit: '送信',
    Change: '変更',
    dropzoneImport: 'ファイルを読み込む',
    example_excel: 'エクセルの例',
    Delete: '削除',
  },
  dropzone: {
    description: 'ファイルをドラッグ&ドロップするか、クリックしてアップロードしてください',
  },
  students: {
    importModal: {
      title: '学生データのインポート',
      subtitle: '任意の種類の学生をインポートしてください。',
      import: 'インポート',
      close: '閉じる',
      dropzone:
        'CSVファイル または Excelファイルをドラッグ&ドロップするか、クリックしてアップロードしてください',
      dropzoneButton: 'ファイルを読み込む',
    },
  },
  users: {
    importModal: {
      title: 'ユーザーのインポート',
      subtitle: '任意の種類のユーザーをインポートしてください。',
      dropzone:
        'CSVファイル または Excelファイルをドラッグ&ドロップするか、クリックしてアップロードしてください',
      dropzoneButton: 'ファイルを読み込む',
      importUsers: 'ユーザーのインポート',
      importExampleExcel: '読み込みエクセルの例',
      importTeachers: '先生データのインポート',
      importTeachersExampleExcel: '先生データの例',
      importParents: '保護者データのインポート',
      importParentsExampleExcel: '保護者データの例',
      loadingText: 'ユーザーデータを作成しています。しばらくお待ちください。',
    },
    importTeachers: {
      title: '先生データのインポート',
      dropzone:
        'CSVファイル または Excelファイルをドラッグ&ドロップするか、クリックしてアップロードしてください',
      dropzoneButton: 'ファイルを読み込む',
    },
  },
  errors: {
    excel: {
      valueNotProvided: 'セルに値がありません。',
    },
  },
}
