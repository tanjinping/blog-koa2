const router = require('koa-router')();
const {getList, getDetail, newBlog, updateBlog, deleteBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

router.prefix('/api/blog');

router.get('/list', async function (ctx, next) {
    const keyword = ctx.query.keyword || "";
    let author = ctx.query.author || "";
    if (ctx.query.isadmin) {
        if (!ctx.session.username) {
            ctx.body = new ErrorModel("未登录");
            return;
        }
        author = ctx.session.username;
    }
    const result = await getList(author, keyword);
    ctx.body = new SuccessModel(result);
});

router.get('/detail', async function (ctx, next) {
    const result = await getDetail(ctx.query.id);
    ctx.body = new SuccessModel(result);
});

router.post('/new', loginCheck, async function (ctx, next) {
    const {body} = ctx.request;
    body.author = ctx.session.username;
    const result = await newBlog(body);
    ctx.body = new SuccessModel(result);
});

router.post('/update', loginCheck, async function (ctx, next) {
    const {body} = ctx.request;
    const result = await updateBlog(ctx.query.id, body);
    if (result) {
        ctx.body = new SuccessModel();
    } else {
        ctx.body = new ErrorModel("更新博客失败");
    }
});

router.post('/del', loginCheck, async function (ctx, next) {
    const author = ctx.session.username;
    const result = await deleteBlog(ctx.query.id, author);
    if (result) {
        ctx.body = new SuccessModel();
    }
    ctx.body = new ErrorModel("删除博客失败");
});

module.exports = router;
