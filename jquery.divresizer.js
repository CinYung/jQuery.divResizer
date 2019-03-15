'use strict';

/**
 *
 * div可拖动调整分栏
 *
 * 示例结构：
 * <div id="top-div"></div>
 * <div r-Type="height|width" div1="#top-div" div2="#bottom-div" store-id="XXX" min="100">
 * <div id="bottom-div"></div>
 *
 * 其中：
 * r-Type: height表示上下拖动调整, width表示左右拖动调整
 * div1: 上（左）部结构的id
 * div2: 下（右）部结构的id
 * store-id：可选，存在则以该值生成key，将调整结果写入localStorage
 * min: 可选，无则默认两部分结构相加的10%
 *
 * setting: {select, callback}
 * 其中：
 * select：选定分栏
 * callback：回调（除了上述两个div外需要调整的，自定义放在此处）
 * 
 * @author Mai
 * @date 2019/3/15
 * @version
 */

(function($){
    $.divResizer = function(setting) {
        const obj = $(setting.select);
        let drag, mouseMoveCount, startPos, orgSize1, orgSize2, newSize1, newSize2, objSize;
        // 根据localStorage初始化
        if (obj.attr('store-id')) {
            const rType = obj.attr('r-type');
            const objSize1 = getLocalCache('v-resize-1-' + obj.attr('store-id'));
            if (objSize1) {
                $(obj.attr('div1')).css(rType, objSize1);
            }
            const objSize2 = getLocalCache('v-resize-2-' + obj.attr('store-id'));
            if (objSize2) {
                $(obj.attr('div2')).css(rType, objSize2);
            }
            if (setting.callback) { setting.callback(); }
        }

        obj.mousedown(function (e) {
            const rType = obj.attr('r-type');
            mouseMoveCount = 0;
            drag = true;
            startPos = rType === 'height' ? e.clientY : e.clientX;
            // 获取左(上)部分的宽度(高度)
            orgSize1 = $($(this).attr('div1'))[rType]();
            // 获取右(下)部分的宽度(高度)
            orgSize2 = $($(this).attr('div2'))[rType]();
            // nav宽(高度)部分
            objSize = $(this)[rType]();
            //resizeElement.tooltip('hide');

        });
        $('body').mousemove(function (e) {
            if (drag) {
                const rType = obj.attr('r-type');
                const moveSize = rType === 'height' ? e.clientY - startPos : e.clientX - startPos;
                //实时刷新页面
                mouseMoveCount += moveSize;
                //当累计移动超过5个像素时，才刷新，减少刷新次数
                if(Math.abs(mouseMoveCount) >=5){
                    const min = obj.attr('min') ? obj.attr('min') : parseInt(((orgSize1 + orgSize2) / 10).toFixed(0));
                    const max = orgSize1 + orgSize2 - min;

                    // 判断拖动范围不能超出
                    newSize1 = Math.min(Math.max(orgSize1 + moveSize, min), max);
                    newSize2 = Math.min(Math.max(orgSize2 - moveSize, min), max);
                    $(obj.attr('div1')).css(rType, newSize1);
                    $(obj.attr('div2')).css(rType, newSize2);

                    if(setting.callback) { setting.callback(); }
                    mouseMoveCount = 0;
                }
            }
        });
        $('body').mouseup(function () {
            if (drag) {
                drag = false;
                const rType = obj.attr('r-type');
                const localId = obj.attr('store-id'), div1 = $(obj.attr('div1')), div2 = $(obj.attr('div2'));
                setLocalCache('v-resize-1-' + localId, div1[rType]());
                setLocalCache('v-resize-2-' + localId, div2[rType]());
            }
        });
    }
})(jQuery);