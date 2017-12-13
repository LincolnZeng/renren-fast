package io.renren.modules.sys.service.impl;

import io.renren.modules.sys.dao.SysTestDao;
import io.renren.modules.sys.entity.SysTestEntity;
import io.renren.modules.sys.service.SysTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by liuning on 2017/12/13.
 */
@Service("sysTestService")
public class SysTestServiceImpl implements SysTestService {

    @Autowired
    private SysTestDao sysTestDao;
    /**
     * 查询测试列表
     * @param map
     * @return
     */
    @Override
    public List<SysTestEntity> queryList(Map<String, Object> map) {
        return sysTestDao.queryList(map);
    }

    /**
     * 查询数量
     * @param map
     * @return
     */
    @Override
    public int queryTotal(Map<String, Object> map) {
        return sysTestDao.queryTotal(map);
    }
}
