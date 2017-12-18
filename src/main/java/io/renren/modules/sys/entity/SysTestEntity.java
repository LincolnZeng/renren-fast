package io.renren.modules.sys.entity;

import org.hibernate.validator.constraints.NotBlank;

import java.io.Serializable;

/**
 * Created by liuning on 2017/12/13.
 */
public class SysTestEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 测试ID
     */
    private Long testId;

    /**
     * 测试名称
     */
    @NotBlank(message="角色名称不能为空")
    private String testName;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建者ID
     */
    private Long createUserId;

    public Long getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(Long createUserId) {
        this.createUserId = createUserId;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
