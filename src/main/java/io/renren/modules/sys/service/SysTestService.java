package io.renren.modules.sys.service;

import io.renren.modules.sys.entity.SysRoleEntity;
import io.renren.modules.sys.entity.SysTestEntity;

import java.util.List;
import java.util.Map;

/**
 * Created by liuning on 2017/12/13.
 */
public interface SysTestService {

    /**
     * 查询测试列表
     * @param map
     * @return
     */
    List<SysTestEntity> queryList(Map<String, Object> map);

    /**
     * 查询测试数量
     * @param map
     * @return
     */
    int queryTotal(Map<String, Object> map);
}
