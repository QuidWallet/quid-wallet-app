import com.microsoft.appcenter.appium.Factory;
import com.microsoft.appcenter.appium.EnhancedAndroidDriver;
import com.microsoft.appcenter.appium.EnhancedIOSDriver;
import io.appium.java_client.MobileElement;
import org.junit.rules.TestWatcher;
import org.junit.Rule;
import org.junit.*;
import java.net.MalformedURLException;
import java.net.URL;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.By;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;


public class LaunchTest {
    @Rule
    public TestWatcher watcher = Factory.createWatcher();

    private static EnhancedIOSDriver<MobileElement> driver;

    @Before
    public void setUp() throws MalformedURLException {
	String userDir = System.getProperty("user.dir");
	String localApp = "app.apk";
	String appPath = Paths.get(userDir, localApp).toAbsolutePath().toString();
		    
	DesiredCapabilities capabilities = new DesiredCapabilities();
	capabilities.setCapability("platformName", "android");
	capabilities.setCapability("deviceName", "ignored");
	capabilities.setCapability("app", appPath);

        
	URL url = new URL("http://localhost:4723/wd/hub");
	
	//driver = Factory.createAndroidDriver(url, capabilities);
	driver = Factory.createIOSDriver(url, capabilities);
	//driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    }

    
    @Test
    public void appDoesLaunch() {
    	try {
    	    Thread.sleep(10000);
    	} catch (InterruptedException ex) {
    	}
    	driver.label("App has launched");
    }
    
    
    @Test
    public void setupWatchwallet() {
    	try {
    	    Thread.sleep(10000);
    	} catch (InterruptedException ex) {
    	}

	MobileElement addressInput = driver.findElement(By.xpath("//android.widget.EditText[1]"));
	addressInput.sendKeys("0x361D4dc565f34c50A9A581302a282b51e8E03E71");
	driver.hideKeyboard();
	driver.label("setupWatchwallet (step 1)");
	driver.findElement(By.xpath("//android.widget.TextView[contains(@text, '" + "Continue" + "')]")).click();
	
	try {
	    Thread.sleep(3000);
	} catch (InterruptedException ex) {
	}
	
	driver.label("setupWatchwallet (step 2)");
    }
    
    @After
    public void TearDown(){
	driver.label("Stopping App");
	driver.quit();
    }
}
