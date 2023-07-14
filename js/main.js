/**
 * Displays the children (files and sub-folders) of a folder.
 * @param {string} scriptURL - The URL of the server-side script used to fetch file data.
 * @param {Array} children - An array of child objects representing the files and sub-folders.
 */

function displayChildren(scriptURL,children) {
	children.forEach((child) => {
		// Check if the child is a file
		if (!child.MimeType.includes('directory')) {
			// Fetch file data using scriptURL and child ID
			fetch(scriptURL+'?id=' +child.id,{ method: 'GET' })
				.then((res) => {return res.text();})
				.then((result) => {
					// Parse the JSON response
					var drive = JSON.parse(result);
					// Display the file using displayFile function
					displayFile(drive.file);
				})
				.catch((err) => console.log('err', err));
			}
		// Check if the child has children (sub-folders)
		if (child.children && child.children.length > 0) {
			// Recursively call displayChildren to display the sub-folders
			displayChildren(scriptURL, child.children);
		}
	});
}

/**
 * Displays the structure of a folder in an HTML list format.
 * @param {HTMLElement} DOMElement - The DOM element where the structure will be displayed.
 * @param {Object} struct - The structure object representing the folder and its children.
 */
function displayStruct(DOMElement, struct) {
	const children = struct.children;
	// Check if there are no children
	if (children.length === 0) {
	    return; // If there are no children, end the recursion
	}
	const ul = document.createElement("ul");

	children.forEach(function(child) {
		const li = document.createElement("li");
		ul.appendChild(li);

		// Add HTML content to the li element
		li.innerHTML = `
			<div> <div class="property ">name</div>     <div class="property-content name">${child.name}</div>				</div>
			<div> <div class="property ">id</div>       <div class="property-content id">${child.id}</div>					</div>
			<div> <div class="property ">MimeType</div> <div class="property-content MimeType">${child.MimeType}</div>			</div>
			<div> <div class="property ">url</div>      <a target="_blank" href="${child.url}" class="property-content">${child.url}</a> </div>
			<div id="${child.id}" class="file"></div>
		`;
		// Check if the child is a directory
		if(child.MimeType.includes("directory")){
			// Check if the directory has children
			if (child.children.length > 0) {
				// Recursively call displayStruct to display the child's children
				displayStruct(li, child);
			}
		}
	});
	DOMElement.appendChild(ul);
}
/**
 * Displays the content of a file based on its MIME type.
 * @param {Object} file - The file object containing the file's ID, MIME type, and bytes.
 */
function displayFile(file){
	const id = file.id;
	const DOMElement = document.getElementById(id)
	/* ----------------- Display Image ----------------- */
	if(file.MimeType.includes("image")){
		const img = document.createElement("img");
		const blob = new Blob([new Uint8Array(file.bytes)], { type: file.MimeType });
		const url = URL.createObjectURL(blob);
		img.width = "500";
		img.src = url;
		img.classList.add("image")
		DOMElement.appendChild(img);
		DOMElement.classList.add("open");
		img.addEventListener("onload",function(){
			URL.revokeObjectURL(url);
		})
	}
	/* ----------------- Display Text ----------------- */
	if(file.MimeType.includes("text")){
		const p = document.createElement("p");
		const div = document.createElement("div");
		const text = new TextDecoder().decode(new Uint8Array(file.bytes));
		p.textContent = text;
		div.classList.add("text")
		DOMElement.appendChild(div);
		div.appendChild(p);
		DOMElement.classList.add("open");
	}
	/* ----------------- Display PDF ----------------- */
	if(file.MimeType.includes("pdf")){
		const iframe = document.createElement("iframe");
		const blob = new Blob([new Uint8Array(file.bytes)], { type: file.MimeType });
		const url = URL.createObjectURL(blob);
		iframe.height = "700px";
		iframe.width = "500px";
		iframe.src = url;
		iframe.classList.add("iframe")
		DOMElement.appendChild(iframe);
		DOMElement.classList.add("open");
		iframe.addEventListener("onload",function(){
			URL.revokeObjectURL(url);
		})
	}
}

