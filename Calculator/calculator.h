#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#define PI 3.14159265

using namespace std;

typedef vector<vector<double> > Matrix;

void interpolationMatrixTest();
void polynomialTest();

void logPolynomial(vector<double> P, string poliName);
void logCalculate(int i, int j, Matrix M, vector<double> x);
void logResult(vector<double> x, Matrix M);

void getVectorStd(vector<double> &P, string poliName);
void getPointsTest(vector<double> &X, Matrix &Y);
void getPointsStd(vector<double> &x, Matrix &M);

void getInterpolationMatrix(vector<double> X, Matrix Y, vector<double> &intpX, Matrix &intpM);
void interpolateMatrix(vector<double> &x, Matrix &M);

vector<double> polynomialAddition(vector<double> P, vector<double> Q);
vector<double> polynomialMultiply(vector<double> P, vector<double> Q);
void fuggveny(double x);

void interpolationMatrixTest() {
	cout << "Interpolacio" << endl;
	vector<double> X;
	Matrix Y;
	vector<double> intpX;
	Matrix intpM;
	getPointsTest(X, Y);
	logResult(X, Y);
	//getPointsStd(intpX, intpM);
	getInterpolationMatrix(X, Y, intpX, intpM);
	//logResult(intpX, intpM);
	interpolateMatrix(intpX, intpM);
	logResult(intpX, intpM);
}

void interpolationTest() {
	vector<double> D, X;
	getVectorStd(D, "DiagonalResult");
	getVectorStd(X, "XResult");
	//TODO : result polinome calculate
}

void getInterpolationMatrix(vector<double> X, Matrix Y, vector<double> &intpX, Matrix &intpM) {
	int l;
	for (int i = 0; i < X.size(); ++i) {
		int start = intpM.size();
		int end = start + Y[i].size();
		intpM.resize(end);
		intpX.resize(end, X[i]);
		l = 1;
		for (int j = start; j < end; ++j) {
			intpM[j].resize(l);
			for (int k = 0; k < l; ++k) {
				intpM[j][k] = Y[i][k];
			}
			l++;
		}
	}

	for (int i = 0; i < intpM.size(); ++i) {
		intpM[i].resize(i + 1, -400000);
	}
}

void getPointsTest(vector<double> &X, Matrix &Y) {
	Y.resize(4);
	for (int i = 0; i < 4; ++i) {
		X.push_back(i);
		Y[i].push_back(i*i);
		Y[i].push_back(2*i);
		//Y[i].push_back(2);
	}
}

void polynomialTest() {
	vector<double> P, Q;
	getVectorStd(P, "P");
	getVectorStd(Q, "Q");

	logPolynomial(P, "P");
	logPolynomial(Q, "Q");
	
	vector<double> R;
	R = polynomialAddition(P, Q);
	logPolynomial(R, "Osszeg");
	R = polynomialMultiply(P, Q);
	logPolynomial(R, "Szorzat");
}

void getVectorStd(vector<double> &P, string poliName) {
	int n;
	cout << poliName <<"\n mekkora? (fok, hossz) n= "; cin >> n;
	P.resize(n);
	for (unsigned i = 0; i < P.size(); i++) {
	 	cout << i << " . elem/tag :"; cin >> P[i];
	};
}

void logPolynomial(vector<double> P, string poliName) {
	cout << poliName << endl;
	int forSize = P.size() - 1;
	for (unsigned i = 0; i < forSize; i++) {
		cout<< P[i] <<" x^"<<i<<" + ";
	};
	cout<< P[forSize] <<" x^"<< forSize << endl; 
}

void logCalculate(int i, int j, Matrix M, vector<double> x) {
	if (x[j] == x[j-i]){
		return;
	}
	cout << i << j << " = ";
	cout << i-1 << j << " - " << i-1 << j-1 << " // " << j << j-i;
	cout << endl;
	cout << M[j][i-1] << " - " << M[j-1][i-1] << " / " << x[j] <<" - "<< x[j-i];
	cout << " = " << M[j][i-1]-M[j-1][i-1] << "/" << x[j]-x[j-i];
	cout << " = " <<  (M[j][i-1]-M[j-1][i-1])/(x[j]-x[j-i]);
	cout << endl;
}

void logResult(vector<double> x, Matrix M) {
	cout << endl <<" Eredmény: "<< M.size() << endl;
	for (int i = 0; i < M.size(); i++) {
		cout<<x[i]<<" | ";
		for (int j = 0; j < M[i].size(); j++) {
			cout<<M[i][j]<<"\t";
		}; 
		cout<<"\n";
	};
}

void getPointsStd(vector<double> &x, Matrix &M) {
	int n;
	cout<<"Adja meg hany pontban vizsgaljuk!"<<endl; 
	cin>>n;
	x.resize(n);
	M.resize(n);
	for (int i = 0; i < n; i++) { 
		M[i].resize(n);
		for (int j = 0; j < n; j++) {
			M[i][j] = 0;
		}
	}

	cout<<"Adja meg a pontokat!"<<endl;
	for (int i = 0; i < n; i++) { 
		cout << i+1 << ". pont: " <<  endl; 
		cout << "\tx: "; cin >> x[i];
		cout << "\tf(x): "; cin >> M[0][i];
	};
}

void interpolateMatrix(vector<double> &x, Matrix &M) {
	int n = M.size();

	cout << endl <<" Kalkulátor Logika: "<< endl;
	for (int i = 1; i < n; i++) {
		for(int j = i; j < n; j++)	{
			//logCalculate(i, j, M, x);
			if (x[j] != x[j-i]) {
				M[j][i] = (M[j][i-1]-M[j-1][i-1])/(x[j]-x[j-i]);
			};
		};
	}
}

vector<double> polynomialAddition(vector<double> P, vector<double> Q) { 
	bool nagyP = false;
	if (P.size() > Q.size()) { 
		nagyP = true;
	}

	vector<double> S (max(P.size(),Q.size()));
	unsigned k;
	for( k=0;k<min(P.size(),Q.size());k++) { 
		S[k]=P[k]+Q[k];
	};
	if (nagyP) {
		for(unsigned i=k;i<S.size();i++){
			S[i]=P[i]; 
		} 
	} else { 
		for(unsigned i=k;i<S.size();i++){
			S[i]=P[i]; 
		}  
	};
  return S;
};

vector<double> polynomialMultiply(vector<double> P, vector<double> Q) {
    vector<double> R((P.size()+Q.size())-1);
    for (unsigned i = 0; i < R.size(); i++) {
    	R[i]=0;
    };
    for (unsigned i = 0; i < P.size(); i++) { 
    	for (unsigned j = 0; j < Q.size(); j++) {  
    		R[i+j] += P[i]*Q[j]; 
   		};
    };
    return R;
};

double f(double x) { 
	double sinx,y;
	sinx = sin (x*PI/180);
	y=(-1)*exp((x/2)*sinx);
	return y;
};
void fuggveny() {
	double x;
	cout << "x= "; cin>> x;
    cout <<"f(x)=  "<< f(x) <<endl;
};
