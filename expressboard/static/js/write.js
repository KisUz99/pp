const form = document.querySelector("form");
const mode = form.getAttribute("data-mode");
const postOption = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

if (mode === "modify") {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const pwd = prompt("기존 패스워드를 입력해주세요");
        const id = document.querySelector("input[type=hidden]").value;
        if (!pwd) {
            return;
        }
        const result = await fetch("/modify", {
            ...postOption,
            body: JSON.stringify({ 
                id: id,
                pwd,
                password: form.password.value,
                title: form.title.value,
                writer: form.writer.value,
                content: form.content.value})
        });
    
        const data = await result.json();
        
        if (data.isModified) {
            document.location = `/detail/${id}`;
        } else {
            alert("패스워드가 올바르지 않습니다.");
        }
    });
}