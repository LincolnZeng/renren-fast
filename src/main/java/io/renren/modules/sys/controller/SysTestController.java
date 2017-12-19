package io.renren.modules.sys.controller;

import io.renren.common.annotation.SysLog;
import io.renren.common.utils.Constant;
import io.renren.common.utils.PageUtils;
import io.renren.common.utils.Query;
import io.renren.common.utils.R;
import io.renren.common.validator.ValidatorUtils;
import io.renren.modules.sys.entity.SysRoleEntity;
import io.renren.modules.sys.entity.SysTestEntity;
import io.renren.modules.sys.service.SysTestService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 测试控制类
 * Created by liuning on 2017/12/13.
 */
@RestController
@RequestMapping("/sys/test")
public class SysTestController extends AbstractController{

    @Autowired
    private SysTestService sysTestService;

    /**
     * 测试列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("sys:test:list")
    public R list(@RequestParam Map<String, Object> params){
        //如果不是超级管理员，则只查询自己创建的角色列表
        if(getUserId() != Constant.SUPER_ADMIN){
            params.put("createUserId", getUserId());
        }

        //查询列表数据
        Query query = new Query(params);
        List<SysTestEntity> list = sysTestService.queryList(query);
        int total = sysTestService.queryTotal(query);

        PageUtils pageUtil = new PageUtils(list, total, query.getLimit(), query.getPage());

        return R.ok().put("page", pageUtil);
    }

    /**
     * 保存测试角色
     */
    @SysLog("保存测试角色")
    @RequestMapping("/save")
    @RequiresPermissions("sys:test:save")
    public R save(@RequestBody SysTestEntity test){
        ValidatorUtils.validateEntity(test);

        test.setCreateUserId(getUserId());
        sysTestService.save(test);

        return R.ok();
    }

    /**
     * 修改测试内容
     * @param testEntity
     * @return
     */
    @SysLog("修改测试角色")
    @RequestMapping("/update")
    @RequiresPermissions("sys:test:update")
    public R update(@RequestBody SysTestEntity testEntity){
        ValidatorUtils.validateEntity(testEntity);
        testEntity.setCreateUserId(getUserId());
        sysTestService.update(testEntity);

        return R.ok();
    }

    /**
     * 删除测试角色
     */
    @SysLog("删除测试角色")
    @RequestMapping("/delete")
    @RequiresPermissions("sys:test:delete")
    public R delete(@RequestBody Long[] testIds){
        sysTestService.deleteBatch(testIds);

        return R.ok();
    }

    /**
     * 测试信息
     */
    @RequestMapping("/info/{testId}")
    @RequiresPermissions("sys:test:info")
    public R info(@PathVariable("testId") Long roleId){
        SysTestEntity test = sysTestService.queryObject(roleId);

        return R.ok().put("test", test);
    }
}
