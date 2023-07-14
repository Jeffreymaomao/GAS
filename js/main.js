
function displayChildren(children) {
	children.forEach((child) => {
		if (!child.MimeType.includes('directory')) {
			fetch('https://script.google.com/macros/s/AKfycbz0lLqo9mwrYgV61LCUXTiuL1iE7QPsnT0_y7YG0tMC7aJ4w7sZWp1kOdKPYYMM-wfd/exec?id=' +child.id,
				{ method: 'GET' })
				.then((res) => {return res.text();})
				.then((result) => {
					const file = JSON.parse(result);
					displayFile(file.file);
				})
				.catch((err) => console.log('err', err));
			}
			if (child.children && child.children.length > 0) {
			displayChildren(child.children); // 递归调用处理子层文件夹的数据
		}
	});
}

function displayStruct(DOMElement, struct) {
	const children = struct.children;

	if (children.length === 0) {
	    return; // 如果没有子元素，结束递归
	}
	const ul = document.createElement("ul");

	children.forEach(function(child) {
		const li = document.createElement("li");
		ul.appendChild(li);
		li.id = child.id;
		li.innerHTML = `
			<div> <div class="property ">name</div>     <div class="property-content name">${child.name}</div>				</div>
			<div> <div class="property ">id</div>       <div class="property-content id">${child.id}</div>					</div>
			<div> <div class="property ">MimeType</div> <div class="property-content MimeType">${child.MimeType}</div>			</div>
			<div> <div class="property ">url</div>      <a target="_blank" href="${child.url}" class="property-content">${child.url}</a> </div>
		`
		// <div class="file"> <div style="background-color:#ccc;width:400px;height:500px">file</div> </div>
		if(child.MimeType.includes("directory")){
			if (child.children.length > 0) {
				displayStruct(li, child); // 递归调用自身来处理子元素
			}
		}
	});
	DOMElement.appendChild(ul);
}

function displayFile(file){
	const id = file.id;
	const DOMElement = document.getElementById(id)
	/* ------------------------------------------------ */
	if(file.MimeType.includes("image")){
		const img = document.createElement("img");
		const blob = new Blob([new Uint8Array(file.bytes)], { type: file.MimeType });
		const url = URL.createObjectURL(blob);
		img.width = "500";
		img.src = url;
		img.classList.add("image")
		DOMElement.appendChild(img);
		img.addEventListener("onload",function(){
			URL.revokeObjectURL(url);
		})
	}

	if(file.MimeType.includes("text")){
		const p = document.createElement("p");
		const div = document.createElement("div");
		const text = new TextDecoder().decode(new Uint8Array(file.bytes));
		p.textContent = text;
		div.classList.add("text")
		DOMElement.appendChild(div);
		div.appendChild(p);
	}

	if(file.MimeType.includes("pdf")){
		const iframe = document.createElement("iframe");
		const blob = new Blob([new Uint8Array(file.bytes)], { type: file.MimeType });
		const url = URL.createObjectURL(blob);
		iframe.height = "700px";
		iframe.width = "500px";
		iframe.src = url;
		iframe.classList.add("iframe")
		DOMElement.appendChild(iframe);
		iframe.addEventListener("onload",function(){
			URL.revokeObjectURL(url);
		})
	}
}

