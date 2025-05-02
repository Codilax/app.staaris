module.exports = {

    appName:"Staaris",
    appVersion: "25.1.1",
    appDescription: "Student AI-Assisted Result Computation System",
    companyName: "Codilax Services",
    website: "https://www.codilax.com",
    activationPage: "https://www.staaris.codilax.com",
    email:"team.codilax@gmail.com",
    
    darkMode : false,
    menuState : true,
    menuExpandable: true,

    activated: false,
    activatedMessage: "Activate in 7days", //message to display at the status bar. e.g. activated, activate in 20 days

    secure : "",      //the passkey is stored here
    secureQuestion: "",
    secureAnswer: "",

    warningDialog : false,
    selectedGradingSystemName : "",
    selectedTemplateName : "",
    haptic: true,
    talkback: true,
    talkbackvoiceindex: -1,

    textColumn: 0,
    numberColumn: 1,
    
    rowHeight: 25,      //row height of result sheet

    headingColumn: 0,
    dataColumn: 1,

    narrow:-1,
    medium:0,
    wide:1,

    //result remarks
    pass:"Pass",
    fail: "Fail",


    isLocked: false,


    //show or do not show add non existing student dialog
    doNotShowExistingStudentDialog: false,
    

    //selected indices using a mouse or ctrl+arrow key
    selectedRows: [],


    //hovered row: current row in which mouse is placed
    hoveredRow: -1,

    //strore the save state of the result
    isSaved: true,

    //default grading systems
    nucGrading: { "source":"default", "name":"NUC", "date": "System default", "ctimeMS": 0, "content": {"passMark":"40","gradingSystem":[{"index":1,"min":"0","max":"39","grade":"F"},{"index":2,"min":"40","max":"44","grade":"E"},{"index":3,"min":"45","max":"49","grade":"D"},{"index":4,"min":"50","max":"59","grade":"C"},{"index":5,"min":"60","max":"69","grade":"B"},{"index":6,"min":"70","max":"100","grade":"A"}]} },
    nbteGrading: { "source":"default", "name":"NBTE", "date": "System default", "ctimeMS": 0, "content": {"passMark":40,"gradingSystem":[{"index":1,"min":"0","max":"39","grade":"F"},{"index":2,"min":"40","max":"44","grade":"E"},{"index":3,"min":"45","max":"49","grade":"D"},{"index":4,"min":"50","max":"54","grade":"CD"},{"index":5,"min":"55","max":"59","grade":"C"},{"index":6,"min":"60","max":"64","grade":"BC"},{"index":7,"min":"65","max":"69","grade":"B"},{"index":8,"min":"70","max":"74","grade":"AB"},{"index":9,"min":"75","max":"100","grade":"A"}] } },
    topfaithGrading: { "source":"default", "name":"Topfaith University", "date": "System default", "ctimeMS": 0, "content": {"passMark":"40","gradingSystem":[{"index":1,"min":"0","max":"39","grade":"F"},{"index":2,"min":"40","max":"44","grade":"E"},{"index":3,"min":"45","max":"49","grade":"D"},{"index":4,"min":"50","max":"59","grade":"C"},{"index":5,"min":"60","max":"69","grade":"B"},{"index":6,"min":"70","max":"100","grade":"A"}]} },
    // ncce: { "source":"default", "name":"NCCE", "date": "System default", "ctimeMS": 0, "content": {"passMark":"40","gradingSystem":[{"index":1,"min":"0","max":"39","grade":"F"},{"index":2,"min":"40","max":"44","grade":"E"},{"index":3,"min":"45","max":"49","grade":"D"},{"index":4,"min":"50","max":"59","grade":"C"},{"index":5,"min":"60","max":"69","grade":"B"},{"index":6,"min":"70","max":"79","grade":"A"}]} },
    

    //default templates
    topfaithTemplate: { "source":"default", "name":"Topfaith University", "date": "System default", "ctimeMS": 0, "content": [{"key":"serial","name":"S/N","dataType":1,"edit":false,"max":0},{"key":"reg","name":"STUDENT ID","dataType":0,"edit":true,"max":0},{"key":"name","name":"STUDENT NAME","dataType":0,"edit":true,"max":0},{"key":"attendance","name":"Attendance","dataType":1,"edit":true,"max":"5"},{"key":"assignment","name":"Assignment","dataType":1,"edit":true,"max":"10"},{"key":"midsemtest","name":"MidSemTest","dataType":1,"edit":true,"max":"10"},{"key":"classpresentation","name":"class presentation","dataType":1,"edit":true,"max":"5"},{"key":"ca","name":"CA","dataType":1,"edit":false,"max":30},{"key":"exam","name":"EXAM","dataType":1,"edit":true,"max":70},{"key":"total","name":"TOTAL","dataType":1,"edit":false,"max":100},{"key":"grade","name":"GRADE","dataType":0,"edit":false,"max":0},{"key":"remark","name":"REMARK","dataType":1,"edit":false,"max":0}]  },
    nucTemplate: { "source":"default", "name":"NUC", "date": "System default", "ctimeMS": 0, "content": [{"key":"serial","name":"S/N","dataType":1,"edit":false,"max":0},{"key":"reg","name":"STUDENT ID","dataType":0,"edit":true,"max":0},{"key":"name","name":"STUDENT NAME","dataType":0,"edit":true,"max":0},{"key":"test1","name":"Test1","dataType":1,"edit":true,"max":"10"},{"key":"test2","name":"Test2","dataType":1,"edit":true,"max":"10"},{"key":"test3","name":"Test3","dataType":1,"edit":true,"max":"10"},{"key":"ca","name":"CA","dataType":1,"edit":false,"max":30},{"key":"exam","name":"EXAM","dataType":1,"edit":true,"max":70},{"key":"total","name":"TOTAL","dataType":1,"edit":false,"max":100},{"key":"grade","name":"GRADE","dataType":0,"edit":false,"max":0},{"key":"remark","name":"REMARK","dataType":1,"edit":false,"max":0}] },
    


    //used in to store existing templates loaded from file
    gradingSystems: [],
    templates: [],

    //selected/highlighted ones
    selectedGradingSystem:"",
    selectedTemplate:"",


    totalUpperBoundary:100,

    //current template from newly created result or newly opened result
    template : [

        //IDENTITY COMPONENTS
        { "key" : "serial", "name":"S/N",  "dataType":1, "edit":false, "max": 10 }, 
        { "key" : "reg", "name":"STUDENT NUMBER",  "dataType":0, "edit":true, "max": 10 }, 
        { "key" : "name", "name":"STUDENT NAME",  "dataType":0, "edit":true, "max": 10 }, //silence column
        
        //CA components
        { "key" : "project", "name":"CLASS PROJECT",  "dataType":1, "edit":true, "max": 10 }, 
        { "key" : "midSemTest", "name":"MID-SEMESTER TEST",  "dataType":1, "edit":true, "max": 10 }, 
        { "key" : "presentation", "name":"PRESENTATION",  "dataType":1, "edit":true, "max": 5 }, 
        { "key" : "attendance", "name":"ATTENDANCE",  "dataType":1, "edit":true, "max": 5 }, 
        
        //TOTAL OF CA
        { "key" : "ca", "name":"CA",  "dataType":1, "edit":false, "max": 30 }, 

        //CONSTANT EXAM COMPONENTS
        { "key" : "exam", "name":"EXAM",  "dataType":1, "edit":true, "max": 70 }, 
        { "key" : "total", "name":"TOTAL",  "dataType":1, "edit":false, "max": 100 }, 
        { "key" : "grade", "name":"GRADE",  "dataType":0, "edit":false, "max": 10 }, 
        { "key" : "remark", "name":"REMARK",  "dataType":1, "edit":false, "max": 10 }, 

    ],
    //currently opened result template name
    templateName:"",


    //raw data of the current result
    resultObject:[],
    //name of currently opened result
    resultName:'',


    //current grading system
    gradingSystem : {
        "passMark":40,
        "gradingSystem":[
            {"index":1,"min":"70","max":"100","grade":"A"},
            {"index":2,"min":"60","max":"69","grade":"B"},
            {"index":3,"min":"50","max":"59","grade":"C"},
            {"index":4,"min":"45","max":"49","grade":"D"},
            {"index":5,"min":"40","max":"44","grade":"E"},
            {"index":6,"min":"0","max":"39","grade":"F"} //check min 0 without quot
        ]
    },
    //name of current grading system
    gradingSystemName:"",

    dateCreated:"",


    //grade to use for an incomplete result
    incompleteResult: "IR",

    //a toggle to display name or reg number in the STUDENT ID column
    toggleName: false,

    actions:{
        "contextDialog":"rcd",
    },


    //used for arrows keys to focus on inputs
    currentRow: 0,
    currentCol: 1,


    //searched indices : found rows in a result
    indicesFound: [],

    //the current index of a searched and found row
    currentFoundStudentIndex: -1,

    //current selected column
    selectedColumn: -1,


    //existing list of saved results
    existingResultList:[],

    //existing list of archived result
    existingArchivesList: [],

    //save to: used to select whether to save in archive or result folder
    saveToFolder: 'results', //or archives

    shouldRefreshResultFileList: false,

    duplicateStudents: [],

    
    //AI ASSIST
    SEPARATOR: "!x4",
    CODE_SECURE: "@)#9&fhjhfi0j28",


    //Student ID append/prepend
    appendText: "",
    prependText: "",


    //app data folders
    dir_archives:"archives",
    dir_gradingSystems: "grading-systems", 
    dir_results: "results", 
    dir_settings: "settings", 
    dir_templates: "templates"

}
