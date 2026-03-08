let currentUserId = "";
let currentUsername = "";

function registerUser(){
    let username = document.getElementById("regUsername").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    fetch("http://localhost:3000/users/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({username,email,password})
    })
    .then(res=>res.json())
    .then(data=>{
        alert("User Registered! Now login.");
        document.getElementById("regUsername").value="";
        document.getElementById("regEmail").value="";
        document.getElementById("regPassword").value="";
    });
}

function loginUser(){
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    fetch("http://localhost:3000/users/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email,password})
    })
    .then(res=>{
        if(res.status===401) throw "Login failed";
        return res.json();
    })
    .then(user=>{
        alert("Login successful!");
        currentUserId = user._id;
        currentUsername = user.username;
        document.getElementById("auth").style.display="none";
        document.getElementById("postSection").style.display="block";
        loadPosts();
    })
    .catch(err=>alert(err));
}

function createPost(){
    let content = document.getElementById("postInput").value;
    if(!currentUserId){ alert("Login first!"); return;}
    fetch("http://localhost:3000/posts/create",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({userId:currentUserId, content})
    })
    .then(res=>res.json())
    .then(data=>{
        document.getElementById("postInput").value="";
        loadPosts();
    });
}
function loadPosts(){
    document.getElementById("postsList").innerHTML = ""; // clear
    fetch("http://localhost:3000/posts")
    .then(res=>res.json())
    .then(posts=>{
        posts.reverse().forEach(post=>{
            let postDiv = document.createElement("div");
            postDiv.className = "post";
            postDiv.setAttribute("data-id", post._id);
            let postHTML = `
                <b>${post.userId===currentUserId ? currentUsername : "User"}</b>: ${post.content}<br>
                ❤️ ${post.likes.length} Likes 
                <button onclick="likePost('${post._id}')">Like</button>
                ${post.userId===currentUserId ? `<button onclick="deletePost('${post._id}')">Delete Post</button>` : ''}
                <br>
                Comments:
                <div>
                    ${post.comments.map((c,i)=>`
                        <p><b>${c.userId===currentUserId ? currentUsername : "User"}:</b> ${c.text} 
                        ${c.userId===currentUserId ? `<button class="comment-delete" onclick="deleteComment('${post._id}',${i})">Delete</button>` : ''}
                        </p>`).join('')}
                </div>
                <input id="comment-${post._id}" placeholder="Comment">
                <button onclick="commentPost('${post._id}')">Comment</button>
            `;
            postDiv.innerHTML = postHTML;
            document.getElementById("postsList").appendChild(postDiv);
        });
    });
}
function commentPost(postId){
    let text = document.getElementById(`comment-${postId}`).value;
    if(!text) return;
    
    // Ensure correct userId is passed
    fetch(`http://localhost:3000/posts/comment/${postId}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({userId: currentUserId, text})
    }).then(()=>{
        document.getElementById(`comment-${postId}`).value = ""; // clear input
        loadPosts(); // reload posts to show new comment + delete button
    });
}
function deletePost(postId){
    fetch(`http://localhost:3000/posts/delete/${postId}/${currentUserId}`,{
        method:"DELETE"
    }).then(()=>loadPosts());
}

function deleteComment(postId, commentIndex){
    fetch(`http://localhost:3000/posts/comment/delete/${postId}/${commentIndex}/${currentUserId}`,{
        method:"DELETE"
    }).then(()=>loadPosts());
}

function likePost(postId){
    fetch(`http://localhost:3000/posts/like/${postId}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({userId:String(currentUserId)})
    }).then(()=>{
        loadPosts();
        // Temporary pop animation
        let postDiv = document.querySelector(`[data-id='${postId}']`);
        if(postDiv){
            postDiv.style.transform = "scale(1.05)";
            setTimeout(()=>postDiv.style.transform="scale(1)",200);
        }
    });
}