#!/bin/bash

read -p "Please enter the APP_ENV: " APP_ENV
read -p "Please enter the NAMESPACE: " NAMESPACE
echo "Is this a release? (yes/no)"
read answer
if [ "$answer" == "yes" ]; then
    echo "Release confirmed."
    echo ""
    ## prompt user for semantic tag
    echo "Please enter the semantic version: "
    read version
    echo ""
    TAG=$version
    HPA=true
    ENV_FILE=.env.production
    echo "You entered $TAG"
elif [ "$answer" == "no" ]; then
    HPA=false
    TAG=$(git rev-parse HEAD | cut -c1-8)
    ENV_FILE=.env.dev
    echo "Creating development build.."
else
    echo "Invalid input. Please enter 'yes' or 'no'."
fi

### Set Environment Variables
set -a # automatically export all variables
source $ENV_FILE
set +a


helm -n $NAMESPACE upgrade -i --debug --wait --atomic \
--set image.repository=promptengineersai/chat-stream-full-stack \
--set image.tag=$TAG \
--set autoscaling.enabled=$HPA \
--set appEnv=$APP_ENV \
--set appVersion=$TAG \
--set openAiApiKey=$OPENAI_API_KEY \
--set promptLayerApiKey=$PROMPTLAYER_API_KEY \
--set googleCseId=$GOOGLE_CSE_ID \
--set googleApiKey=$GOOGLE_API_KEY \
--set serpapiApiKey=$SERPAPI_API_KEY \
--set weatherApiKey=$WEATHER_API_KEY \
--set yahooFinanceApiKey=$YAHOOFINANCE_API_KEY \
--set alpacaApiKey=$ALPACA_API_KEY \
--set alpacaApiSecret=$ALPACA_SECRET_KEY \
--set s3AccessKey=$S3_ACCESS_KEY \
--set s3SecretKey=$S3_SECRET_KEY \
--set s3BucketName=$S3_BUCKET_NAME \
--set mongoConnection=$MONGO_CONNECTION \
server ./k8s/charts

echo ""
echo ""

kubectl -n $NAMESPACE get all