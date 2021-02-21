window.onload = function(){
    el = document.getElementById("aboutArticle").style = "block";
}

function loadArticle(elem){
    var elements = document.getElementsByClassName("content");
    for(var i = 0; i<elements.length; i++)
        elements[i].style = "display : none;";
    switch(elem.id){
        case "about":
            document.getElementById("aboutArticle").style = "block";
            break;
        case "wstep_poziomy":
            document.getElementById("wstepPoziomyArticle").style = "block";
            break;
        case "wstep_ukosny":
            document.getElementById("wstepUkosnyArticle").style = "block";
            break;
        case "rzut_poziomy":
            document.getElementById("poziomyArticle").style = "block";
            prepareCanvas("poziomy");
            predictionPoziomy(0,"none");
            break;
        case "rzut_ukosny":
            document.getElementById("ukosnyArticle").style = "block";
            prepareCanvas("ukosny");
            predictionUkosny(0,"none");
            break;    
    }
}


function prepareCanvas(canvas_id){
    //wypelnienie osi ukladu
    var canvas = document.getElementById(canvas_id);
    if(canvas.getContext){
        var grid_size = 40;
        var x_axis_distance_grid_lines = 14;
        var y_axis_distance_grid_lines = 1;
        var x_axis_starting_point = { number: 1, suffix: '' };
        var y_axis_starting_point = { number: 1, suffix: '' };
        
        var ctx = canvas.getContext("2d");

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);//czyscimy canvas


        var canvas_width = canvas.width;
        var canvas_height = canvas.height;
        var num_lines_x = Math.floor(canvas_height/grid_size);
        var num_lines_y = Math.floor(canvas_width/grid_size);
        for(var i=0; i<=num_lines_x; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
    
            if(i == x_axis_distance_grid_lines) 
                ctx.strokeStyle = "#000000";
            else
                ctx.strokeStyle = "#ced4da";
    
            if(i == num_lines_x) {
            ctx.moveTo(0, grid_size*i);
            ctx.lineTo(canvas_width, grid_size*i);
            }
            else {
            ctx.moveTo(0, grid_size*i+0.5);
            ctx.lineTo(canvas_width, grid_size*i+0.5);
            }
            ctx.stroke();
        }

        for(i=0; i<=num_lines_y; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
    
            if(i == y_axis_distance_grid_lines) 
                ctx.strokeStyle = "#000000";
            else
                ctx.strokeStyle = "#ced4da";

            if(i == num_lines_y) {
                ctx.moveTo(grid_size*i, 0);
                ctx.lineTo(grid_size*i, canvas_height);
            }
            else {
                ctx.moveTo(grid_size*i+0.5, 0);
                ctx.lineTo(grid_size*i+0.5, canvas_height);
            }
            ctx.stroke();
        }

        ctx.translate(y_axis_distance_grid_lines*grid_size, x_axis_distance_grid_lines*grid_size);

    for(i=1; i<(num_lines_y - y_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        ctx.moveTo(grid_size*i+0.5, -3);
        ctx.lineTo(grid_size*i+0.5, 3);
        ctx.stroke();

        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(x_axis_starting_point.number*i + x_axis_starting_point.suffix, grid_size*i-2, 15);
    }

    for(i=1; i<x_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        ctx.moveTo(-3, -grid_size*i+0.5);
        ctx.lineTo(3, -grid_size*i+0.5);
        ctx.stroke();

        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, -grid_size*i+3);
    }        
        }else{
            alert("Canvas error!");
        }      
}


function predictionPoziomy(value, outID){
    if(outID != "none")
        document.getElementById(outID).value = Number(value).toFixed(2);
    prepareCanvas("poziomy");
    var canvas = document.getElementById("poziomy");
    var H = document.getElementById("wysokosc").value;    
    var g = document.getElementById("gravity").value;
    var V0 = document.getElementById("predkosc").value;

    var grid_size = 40;

    if(canvas.getContext){
            var context = canvas.getContext("2d");
            context.lineWidth = 2;
            context.strokeStyle = "#333";
            context.beginPath();
            var x = 0;
            for(var x = 0; x <= 23; x += 0.02){
                var y = poziomy(H, g, V0, x);
                console.log("H: " + H + "x: " + 40*x +" y: " + 40*y);
                if(y < 0)
                    break;
                context.lineTo(40*x, -40*y);
            }
            context.lineJoin = 'round';
            context.lineWidth = 1;
            context.strokeStyle = "red";
            context.stroke();

            wypelnijParametryPoziomego();
        }else{
            alert("Canvas error!");
        } 
}

function predictionUkosny(value, outID){
    if(outID != "none")
        document.getElementById(outID).value = Number(value).toFixed(2);
    prepareCanvas("ukosny");
    var canvas = document.getElementById("ukosny");
    var H = document.getElementById("wysokoscUkosny").value;    
    var g = document.getElementById("gravityUkosny").value;
    var V0 = document.getElementById("predkoscUkosny").value;
    var alpha = document.getElementById("katUkosny").value;

    if(canvas.getContext){
        var context = canvas.getContext("2d");
        context.lineWidth = 2;
        context.strokeStyle = "#333";
        context.beginPath();
        var x = 0;
        for(var x = 0; x <= 23; x += 0.02){
            var y = ukosny(H, g, V0, x, alpha);
            if(y < 0)
                break;
            context.lineTo(40*x, -40*y);
        }
        context.lineJoin = 'round';
        context.lineWidth = 1;
        context.strokeStyle = "red";
        context.stroke();

        wypelnijParametryUkosnego();
    }else{
        alert("Canvas error!");
    } 
}

function poziomy(H, g, V0, x){
    var res = H - 1.0 * g/(2*V0*V0) * Math.pow(x,2);
    return res;
}

function poziomyZasieg(V0, H, g){
    var res = V0 * Math.sqrt((2*H)/g);
    return res;
}

function poziomyCzas(H,g){
    return Math.sqrt((2*H)/g);
}

function ukosny(H,g,V0, x, alpha){
    var alphaRad = alpha * (Math.PI/180);
    return parseFloat(H) + 1.0 * x*Math.tan(alphaRad) - (g/(2.0*Math.pow(V0,2) * Math.pow(Math.cos(alphaRad),2))) * Math.pow(x,2);
}

function ukosnyZasieg(H, V0, alpha, g){
    var alphaRad = alpha * (Math.PI/180);
    return V0*Math.cos(alphaRad) * (V0*Math.sin(alphaRad)/g + Math.sqrt(2*H/g + Math.pow(V0*Math.sin(alphaRad)/g,2)));
}

function ukosnyWysokosc(H, V0, alpha, g){
    var alphaRad = alpha * (Math.PI/180);
    return parseFloat(H) + ( Math.pow(V0,2) * Math.pow(Math.sin(alphaRad),2) ) / (2*g);
}

function ukosnyCzasSpadku(H, V0, alpha, g){
    var alphaRad = alpha * (Math.PI/180);
    return Math.sqrt((2 * H) / g + Math.pow(V0*Math.sin(alphaRad),2)/(g*g));
}

function ukosnyCzasCalkowity(H, V0, alpha, g){
    var alphaRad = alpha * (Math.PI/180);
    return (V0*Math.sin(alphaRad))/g + ukosnyCzasSpadku(H,V0,alpha,g);
}

function wypelnijParametryPoziomego(){
    var H = document.getElementById("wysokosc").value;    
    var g = document.getElementById("gravity").value;
    var V0 = document.getElementById("predkosc").value;
    document.getElementById("zasiegDiv").innerHTML = Number(poziomyZasieg(V0, H, g)).toFixed(2);
    document.getElementById("czasDiv").innerHTML = Number(poziomyCzas(H,g)).toFixed(2);
}

function wypelnijParametryUkosnego(){
    var H = document.getElementById("wysokoscUkosny").value;    
    var g = document.getElementById("gravityUkosny").value;
    var V0 = document.getElementById("predkoscUkosny").value;
    var alpha = document.getElementById("katUkosny").value;
    document.getElementById("zasiegUkosnegoDiv").innerHTML = Number(ukosnyZasieg(H, V0, alpha, g)).toFixed(2);
    document.getElementById("wysokoscUkosnegoDiv").innerHTML = Number(ukosnyWysokosc(H, V0, alpha, g)).toFixed(2);
    document.getElementById("czasSpadkuUkosnegoDiv").innerHTML = Number(ukosnyCzasSpadku(H, V0, alpha, g)).toFixed(2);
    document.getElementById("czasLotuUkosnegoDiv").innerHTML = Number(ukosnyCzasCalkowity(H, V0, alpha, g)).toFixed(2);
}

function simulateUkosny(){
    prepareCanvas("ukosny");
    wypelnijParametryUkosnego();
    var canvas = document.getElementById("ukosny");
    var H = document.getElementById("wysokoscUkosny").value;    
    var V0 = document.getElementById("predkoscUkosny").value;
    var alpha = document.getElementById("katUkosny").value;
    var g = document.getElementById("gravityUkosny").value;
    var alphaRad = alpha * (Math.PI/180);

    var x = 0;
    var y = parseFloat(H);
    var radius = 20;


    var vx = V0*Math.cos(alphaRad);
    var vy = V0*Math.sin(alphaRad);

    var ax = 0;
    var ay = -g;

    var dt = 0.02;
    var t = 0;

    if(canvas.getContext){
        var context = canvas.getContext("2d");
        while(y >= 0){
            task(t, context, x, y, radius, vx, vy);
            //updateVx
            var vx_new = vx + ax*dt;
            x = x + 0.5*(vx + vx_new)*dt;
            //updateVy
            var vy_new = vy + ay*dt;
            y = y + 0.5*(vy + vy_new)*dt;
            vx = vx_new;
            vy = vy_new;
            t = t + dt;
            // console.log("x: " + x + " y: " + y + " H: " + H);
        }
    }else{
        alert("Canvas context error");
    }

}

function simulatePoziomy(){
    prepareCanvas("poziomy");
    var canvas = document.getElementById("poziomy");
    var H = document.getElementById("wysokosc").value;    
    var g = document.getElementById("gravity").value;
    var V0 = document.getElementById("predkosc").value;

    wypelnijParametryPoziomego();

    var x = 0;
    var y = parseFloat(H);
    var radius = 20;


    var vx = V0;
    var vy = 0;

    var ax = 0;
    var ay = -g;

    var dt = 0.02;
    var t = 0;

    var inp1 = document.getElementById("vxRowPoziomy");

    if(canvas.getContext){
        var context = canvas.getContext("2d");
        while(y >= 0){
            task2(t, context, x, y, radius, vx, vy);
            //updateVx
            var vx_new = vx;// + ax*dt;
            x = x + vx*dt;
            //updateVy
            var vy_new = vy + ay*dt;
            y = y + 0.5*(vy + vy_new)*dt;
            vx = vx_new;
            vy = vy_new;
            t = t + dt;
        }
    }else{
        alert("Canvas context error");
    }
}

function task(i, context, x, y, radius, vx, vy) { 
    setTimeout(function() { 
        prepareCanvas("ukosny");
        context.beginPath();
        context.fillStyle = "#59163B"
        drawCircle(context, x, y, radius);
        document.getElementById("vxRowUkosny").innerHTML = Number(vx).toFixed(2);
        document.getElementById("vyRowUkosny").innerHTML = Number(vy).toFixed(2);
        context.fill();
        context.closePath();
    }, 1500 * i); 
} 

function task2(i, context, x, y, radius, vx, vy) { 
    setTimeout(function() { 
        prepareCanvas("poziomy");
        context.beginPath();
        context.fillStyle = "#59163B"
        drawCircle(context, x, y, radius);
        //temp
        document.getElementById("vxRowPoziomy").innerHTML = Number(vx).toFixed(2);
        document.getElementById("vyRowPoziomy").innerHTML = Number(vy).toFixed(2);
        /////
        context.fill();
        context.closePath();
    }, 1500 * i); 
  } 

function drawCircle(context, x, y, radius){
    context.arc(40*x, -40*y, radius, 0, 2*Math.PI, true);
    context.stroke();
}