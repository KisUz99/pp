const postOption = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const id = document.querySelector("b").getAttribute('data-id');
async function modifyPost() {
    // const password = prompt("패스워드를 입력해주세요");
    // if (!password) {
    //     return;
    // }

    // const result = await fetch("/check-password", {
    //     ...postOption,
    //     body: JSON.stringify({ id: id, password})
    // });

    // const data = await result.json();

    // if (data.isExist) {
    //     document.location = `/modify/${id}`;
    // } else {
    //     alert("패스워드가 올바르지 않습니다.");
    // }
    document.location = `/modify/${id}`;
};

const deleteOption = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
};

async function deletePost() {
    const password = prompt("삭제하려면 패스워드를 입력해주세요");
    if (!password) {
        return;
    }

    const result = await fetch("/delete", {
        ...deleteOption,
        body: JSON.stringify({ id: id, password})
    });

    const data = await result.json();
    if (!data.isSuccess) {
        alert("삭제에 실패했습니다. 패스워드를 확인해주세요.");
        return;
    }

    document.location = "/";
};

async function deleteComment(idx) {
    const password = prompt("비밀번호를 입력해주세요");
    if (!password) {
        return;
    }

    const result = await fetch("/delete-comment",{
        ...deleteOption,
        body: JSON.stringify({
            id: id,
            idx: idx,
            password: password
        })
    });

    const data = await result.json();
    if (!data.isSuccess) {
        alert("삭제에 실패하였습니다 \n 비밀번호를 확인해주십시요");
        return;
    }
    
    alert("삭제 성공");
    location.reload();
};