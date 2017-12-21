package io.renren.modules.app.annotation;

import java.lang.annotation.*;

/**
 * app登录效验
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017/9/23 14:30
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)//注解会在class字节码文件中存在，在运行时可以通过反射获取到
@Documented
public @interface Login {
}
