from bs4 import BeautifulSoup;
import requests ;
import json;

def makeRequestAndGetHtml(mobileSpecificationLink):
    clickedPhoneURL = mobileSpecificationLink;
    phoneSpecificationContent = requests.get(clickedPhoneURL);
    soup = BeautifulSoup(phoneSpecificationContent.text,"html.parser");
    return soup;
def getPhoneSpecification(mobileSpecificationLink):
    topSpecificationData = {}
    localTempArr = [];
##    clickedPhoneURL = mobileSpecificationLink;
##    phoneSpecificationContent = requests.get(clickedPhoneURL);
    soup = makeRequestAndGetHtml(mobileSpecificationLink);
    specificationData = (soup.find("div", {"class": "item-specification-top"}).getText().replace("\n", "").strip());
    for topSpecficaion in soup.find_all('ul', {'class': 'specification-top'}):
        for litag in topSpecficaion.find_all('li'):
##            print(litag.find('span').getText());
            localTempArr.append(litag.find('span').getText())

##    print(localTempArr);
    topSpecificationData["camera"] = localTempArr[0];
    topSpecificationData["battery"] = localTempArr[1];
    topSpecificationData["os"] = localTempArr[2];
    topSpecificationData["storage"] = localTempArr[3];
    topSpecificationData["display"] = localTempArr[4];
    return topSpecificationData;


def getFullPhoneSpec(mobileSpecificationLink):
## Getting Full Sepc 
    fullSpecificationData = {};
##    clickedPhoneURL = mobileSpecificationLink;
##    phoneSpecificationContent = requests.get(clickedPhoneURL);
    soup = makeRequestAndGetHtml(mobileSpecificationLink);
    specificationData = (soup.find("div", {"class": "item-specification"}).getText().replace("\n", "").strip());
    for topSpecficaion in soup.find_all('ul', {'class': 'specification'}):
        for litag in topSpecficaion.find_all('li'):
            fullSpecificationData[litag.find('label').getText()] = litag.find('span').getText()
##            print(litag.find('label').getText());
##            print(litag.find('span').getText());

##    print("Full Spec")
##    print(fullSpecificationData);
##    print("Full Spec")
    return fullSpecificationData;
def getMemory(mobName):
    tempVar = mobName;
    if (tempVar.find('Samsung')):
        memory = {"size1":"32 GB","size2":"64 GB","size3":"128 GB"}
        return memory;
    else:
        memory = {"size1":"64 GB","size2":"128 GB","size3":"256 GB"}
        return memory;

def getColour(mobName):
    tempVar = mobName;
    if (tempVar.find('Samsung')):
        memory = {"colour1":"Black","colour2":"Blue","colour1":"Grey"}
        return memory;
    else:
        memory = {"colour1":"Grey","colour1":"Silver"}
        return memory;
                
    
## JSON file to be saved in DB
phoneDataSet = {"phones":[]};

tempArr = []
urlArray = ["https://eshop.lycamobile.co.uk/pay-as-you-go-mobile-phones?manufacturer=10&p=1","https://eshop.lycamobile.co.uk/pay-as-you-go-mobile-phones?manufacturer=10&p=2","https://eshop.lycamobile.co.uk/pay-as-you-go-mobile-phones?manufacturer=11"]
base_url = "https://eshop.lycamobile.co.uk/pay-as-you-go-mobile-phones"
mobileId = 100;
for url in urlArray:
##    print(url)
    content = requests.get(url);
    soup = BeautifulSoup(content.text,"html.parser");
    #print(soup);
    
    phoneData =soup.find_all("div", {"class": "product-item-info"});
##  Loops through each mobile phone listen in the site. if there was 6mobile phones listed then loops 6
    for row in soup.find_all("div", {"class": "product-item-info"}):
        mobName = (row.find("a", {"class": "product-item-link"}).getText().replace("\n", "").strip());
        mobileSpecificationLink = ((row.find("a", {"class": "product-item-link"}).get('href')));
        ##print((row.find("a", {"class": "product-item-link"}).get('href')));
        
        mobPrice = (row.find("span", {"class": "price-wrapper "}).getText().replace("\n", "").strip());
        mobStock = (row.find("div", {"class": "stock available"}).getText().replace("\n", "").strip());
        
##        getColours(mobName);
        phoneDataSet['phones'].append({'mobileId':mobileId,'mobileName':mobName,\
                                       'mobilePrice':int(float(mobPrice.replace('£','').replace(',',''))),'mobileStock':mobStock, \
                                       "topSpec":getPhoneSpecification(mobileSpecificationLink),\
                                       "fullSpec":getFullPhoneSpec(mobileSpecificationLink),\
                                       "sizeVariant":getMemory(mobName),"colourVariant":getColour(mobName)});
        mobileId = mobileId + 1;
##        break;
        print();
        

## If getting price return this error 'NoneType' object has no attribute 'getText'
## it means product is either out of stock or not sold anymore

    
print(phoneDataSet);
with open('data3.json', 'w') as fp:
    json.dump(phoneDataSet, fp)






## Due to website using same class name for both size and colour im unable to get colour :(
def getColourVariants(mobileSpecificationLink):
    print("Getting Colour Variant")
    soup = makeRequestAndGetHtml(mobileSpecificationLink);
    colourVariatnsData = (soup.find("div", {"class": "swatch-attribute-selected-option"}));
    print(colourVariatnsData)

#soup.find("div", {"class": "product-item-info"});

##data = {"name":"Sameerul"}
##new_result = {'Mobile_Name':'Samsung S9+','Price':'£649.00'}
##phoneDataSet['phones'].append(new_result)
####print(phoneData)

##new_result = {'Mobile_Name':'Samsung S7 Edge','Price':'£546.00','topSpecification':{'camera':'12mp'}}
##phoneDataSet['phones'].append(new_result)
##print(phoneDataSet)
##with open('data.json', 'w') as fp:
##    json.dump(phoneDataSet, fp)    
    
