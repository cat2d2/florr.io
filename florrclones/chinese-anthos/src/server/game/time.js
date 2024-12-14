/*
时间相关的方法

使用变量域: $ = this.var.time
*/

function init() { // 初始化
	const $ = this.var.time = {};
	$.lastUpdTime = Date.now();
}

function update() {
	const $ = this.var.time ??= {};
	const now = Date.now();
	$.dt = now - $.lastUpdTime; // 两次更新经过的时间
	$.lastUpdTime = now;
}

export {
	init,
	update,
};