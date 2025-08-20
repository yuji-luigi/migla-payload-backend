export const enCustomTranslations = {
  common: {
    example_excel: 'Example Excel file',
  },
  components: {
    dropzone: {
      description: 'Drop files here or click to upload',
      button: 'Import',
    },
  },
  dashboard: {
    setup: 'Setup',
    please_initialize: "Let's get start with the MIGLA dashboard",
    initialize_basic_data: 'Please initialize the basic data from here.',
    import_basic_data: 'Import excel file to initialize the basic functionality',
    classrooms_title: '{{count}} classrooms created',
    teachers_title: '{{count}} teachers created',
    parents_title: '{{count}} parents created',
    students_title: '{{count}} students created',
    no_classrooms_title: 'No classrooms created yet.',
    no_teachers_title: 'No teachers created yet.',
    no_parents_title: 'No parents created yet.',
    no_students_title: 'No students created yet.',

    create_classrooms: 'Please create classrooms manually or import from excel file.',
    create_teachers: 'Please create teachers manually or import from excel file.',
    create_parents: 'Please create parents manually or import from excel file.',
    create_students: 'Please create students manually or import from excel file.',
    modal: {
      check_file: 'Please check the file.',
      import_classroom_heading: "Let's register the classrooms.",
      import_teachers_heading: "Let's register the teachers.",
      import_users_heading: "Let's register the users.",
      import_classroom_completed: 'The classrooms have been registered.',
      import_teachers_completed: 'The teachers have been registered.',
      import_users_completed: 'The users have been registered.',
      import_parents_students_heading: "Let's register the parents and students.",
      import_parents_students_completed: 'The parents and students have been registered.',
    },
  },
  authentication: {
    ERROR_NO_ROLE: 'This user does not have access',
    'Login as': 'Select the role to login',
    Admin: 'Admin',
    Teacher: 'Teacher',
    'If you are an': 'If you are an {{role}}',
  },
  button: {
    Import: 'Import',
    Close: 'Close',
    Submit: 'Submit',
    Change: 'Change',
    dropzoneImport: 'Import',
    example_excel: 'Example Excel file',
    Delete: 'Delete',
  },

  students: {
    importModal: {
      title: 'Import Students',
      subtitle: 'Import desired type of students.',
      dropzone: 'Drop files here or click to upload',
      import: 'Import',
      close: 'Close',
      dropzoneButton: 'Import',
    },
  },
  users: {
    importModal: {
      title: 'Import Users',
      subtitle: 'Import desired type of users.',
      dropzone: 'Drop files here or click to upload',
      dropzoneButton: 'Import',
      importUsers: 'Import mixed users',
      importExampleExcel: 'Example Excel file for teachers',
      importTeachers: 'Import Teachers',
      importTeachersExampleExcel: 'Example Excel file for teachers',
      importParents: 'Import Parents',
      importParentsExampleExcel: 'Example Excel file for parents',
      loadingText: 'User data is being created. It can take some minutes...',
    },
    importTeachers: {
      title: 'Import Teachers',
      dropzone: 'Drop files here or click to upload',
      dropzoneButton: 'Import',
    },
  },
  teachers: {
    importModal: {
      title: 'Import Teachers',
      subtitle: 'Import desired type of teachers.',
      dropzone: 'Drop files here or click to upload',
      dropzoneButton: 'Import',
    },
  },
  classrooms: {
    importModal: {
      title: 'Import Classrooms',
      subtitle: 'Import desired type of classrooms.',
      loadingText: 'Classrooms data is being created. It can take some minutes...',
    },
  },
  paymentSchedules: {
    paymentRecordLinkText: 'Go to payment records',
  },
  errors: {
    excel: {
      valueNotProvided: 'Value is not provided in the cell',
    },
    delete: {
      generic: 'This {{collectionLabel}} cannot be deleted. Reason: {{reason}}',
      classroom: 'This classroom cannot be deleted. Reason: {{reason}}',
    },
  },
}
