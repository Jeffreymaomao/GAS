# Google App Script

This project is a web application that allows users to browse and explore the file structure of a Google Drive folder. It utilizes Google Apps Script (GAS) for server-side scripting and Google Drive API for accessing file data.



## Note-data

 I send the data by Google App Script (GAS), I use the Oject format as follow

1. Fisrt I send a folder structure to GAS, then return
    ```javascript
    {
        "struct": {
            "name"    : <folder google drive name>,
            "id"      : <folder google drive id>,
            "MimeType": "inode/directory",  
            "url"     : <folder google drive url>,        
            "children": [...]                   
        }
    }
    ```

    Notice that, in the `children` array, it may container another `file` or `folder` , which will be like 

    ```javascript
    // folder
    {
        "name"    : <folder google drive name>,
        "id"      : <folder google drive id>,
        "MimeType": "inode/directory",  
        "url"     : <folder google drive url>,        
        "children": [...]   
    }
    ```

    and

    ```javascript
    // file
    {
        "name"    : <file google drive name>,
        "id"      : <file google drive id>,
        "MimeType": <file MimeType>,
        "url"     : <file google drive url>,
    }
    ```

2. Second, for every `file`, html will send a request to GAS by file id to get the `Blob` data in `bytes[]` , then GAS will return

    ```javascript
    {
        "name"    : <file google drive name>,
        "id"      : <file google drive id>,
        "MimeType": <file MimeType>,
        "url"     : <file google drive url>,
        "bytes"   : <file blob data(bytes)>
    }



---

### Note-flowchart

```
index.html => fetch request to Google App Script =>{
	fetch method : "GET":
		1. call get.gs 
		2. call function doGet(){}
		3. return data to html
	fetch method : "POST"
		1. ...
}  
```

---

### Note-Process of Get data from Drive

1. [Google Drive](https://drive.google.com/) : 新建試算表 ( `data.xlsm` )、新建兩個Google Apps Scripts ( `get.gs` )

2. `get.gs` 檔案中新建函數 `doGet` (一定要叫這個名字)，也不一定要用以下方法，但是最後output都是字串，所以用成Object之後，轉成.json，最後將其轉成字串後回傳。呼叫檔案的詳細方法可以看

    [Google App Script API](https://developers.google.com/apps-script/api/reference/rest?hl=zh-tw)

    ```javascript
    function doGet() {
      const folder = DriveApp.getFolderById("1sYpxMW1eiMoo13OicFxBbi__MStqPxpZ"); // folder id from URL
      const files = folder.getFiles();
    
      const output = {"data":[]};
    
      while (files.hasNext()) {
        const file = files.next();
        const blob = file.getBlob()
    
        output.data.push({
          "name"    : file.getName(),
          "id"      : file.getId(),
          "MimeType": file.getMimeType(),
          "url"     : file.getUrl(),
          "bytes"   : blob.getBytes(), 
        })
      }
    
      var stringResult = JSON.stringify(output);
      return ContentService.createTextOutput(stringResult).setMimeType(ContentService.MimeType.JSON);
    }
    ```

3. 部署網頁程式

    - 選擇新增部署
    - 選取類型：網頁應用程式
    - 執行身份：我
    - 誰可以存取：所有人

### Note-Process of Post data to Drive

1. [Google Drive](https://drive.google.com/) : 新建試算表 ( `data.xlsm` )、新建兩個Google Apps Scripts ( `post.gs`, `get.gs` )

2. `post.gs` 檔案中新建函數（還沒用）

    ```javascript
    function doPost(e) {
      var param = e.parameter;
      var left = param.left;
      var right = param.right;
      var replyMsg = 'left' + left + 'right' + right;
      doGet(e)
      return ContentService.createTextOutput(replyMsg);
    }
    
    function doGet(e) {
      var params = e.parameter;
      var sheetUrl = params.sheetUrl;
      var sheetTag = params.sheetTag;
    
      var SpreadSheet = SpreadsheetApp.openById(sheetUrl);
      var Sheet = SpreadSheet.getSheetByName(sheetTag);
      Sheet.appendRow([params.left, params.right]);
      
      return ContentService.createTextOutput(true);
    }
    ```



---

#### 

## Note-develope 

#### Google Sheet

```javascript
/* -- Google App Script for Sheet--*/
function parseSheet(sheetUrl, sheetTag){
  const SpreadSheet = SpreadsheetApp.openById(sheetUrl);
  const Sheet = SpreadSheet.getSheetByName(sheetTag);
  const table = Sheet.getRange(1,1,Sheet.getLastRow(), Sheet.getLastColumn()).getValues();
  return table;
}
```

#### deploy 部署

1. 若是重新更改Google App Script 的程式內容，就需要重新部署
2. 可以先測試部署，看看部署完成的網址會回傳什麼



#### Class

總監範例雲端硬碟：https://drive.google.com/drive/folders/1-lu09sgUFEAN3iBVmhsIxqOV6fABcHvj

範例參考網址：https://www.wfublog.com/2017/01/google-apps-script-spreadsheet-write-data.html

- getData 拿資料

- postData 上傳資料

- 權限要打開

- 一定要部署
