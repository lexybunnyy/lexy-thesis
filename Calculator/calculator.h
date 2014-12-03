#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#define PI 3.14159265

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

void interpolationMatrixTest();
void polynomialTest();

void logPolynomial(DArray P, string poliName);
void logCalculate(int i, int j, DMatrix M, DArray x);
void logResult(DArray x, DMatrix M);
void logVector(DArray P, string vectorName) ;

void getVectorStd(DArray &P, string poliName);
void getPointsTest(DArray &X, DMatrix &Y);
void getPointsStd(DArray &x, DMatrix &M);

void getInterpolationMatrix(DArray X, DMatrix Y, DArray &intpX, DMatrix &intpM);
void interpolateMatrix(DArray &x, DMatrix &M);

DArray polynomialAddition(DArray P, DArray Q);
DArray polynomialMultiply(DArray P, DArray Q);
void fuggveny(double x);

DArray l(int j, DArray X);
DArray getLagrangePolinomyal(DArray X, DArray Y);
DArray omega(int j, DArray X);
DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag);

void interpolationMatrixTest() {
	cout << "Interpolacio" << endl;
	DArray X;
	DMatrix Y;
	DArray intpX;
	DMatrix intpM;
	getPointsTest(X, Y);
	logResult(X, Y);
	//getPointsStd(intpX, intpM);
	getInterpolationMatrix(X, Y, intpX, intpM);
	//logResult(intpX, intpM);
	interpolateMatrix(intpX, intpM);
	logResult(intpX, intpM);
}

void interpolationTest() {
	DArray D, X, Y, Res;
	getVectorStd(X, "XResult");
	getVectorStd(Y, "YResult");
	getVectorStd(D, "DiagonalResult");
	logVector(X, "X");
	logVector(Y, "Y");
	logVector(D, "DiagonalResult");

	//TODO : Fix!
	Res = getLagrangePolinomyal(X, Y);
	logVector(Res, "Result");

	//TODO : Fix!
	Res = getNewtonPolinomyal(X, D);
	logVector(Res, "Result");
}


//TODO : Test!
DArray l(int j, DArray X) {
	DArray multip;
	DArray lj;
	
	int m = 0;
	if(j == m ) {
		m = 1;
	}
	
	lj.resize(2, 0);
	multip.resize(2, 0);
	
	lj[0] = X[m]/X[j]-X[m];
	lj[1] = 1;
	for (++m; m < X.size(); ++m) {
		if(m == j){
			break;
		}
		multip[0] = X[m]/(X[j]-X[m]);
		multip[1] = 1;
		lj = polynomialMultiply(lj, multip);
	}
	return lj;
}

//TODO : Test!
DArray getLagrangePolinomyal(DArray X, DArray Y) {
	DArray y(1);

	DArray result;
	DArray multip;

	int j = 0;
	result = polynomialMultiply(y,l(j, X));
	for (++j; j < X.size(); ++j) {
		y[0] = Y[j];
		multip = polynomialMultiply(y,l(j, X));
		result = polynomialMultiply(result, multip);
	}
	return result;
}

//TODO : Test!
DArray omega(int j, DArray X) {
	DArray y(1);

	DArray result(2);
	DArray multip(2);

	int m = 0;
	result[0] = X[m];
	result[1] = 1;
	for (++m; m < j; ++m) {
		multip[0] = X[m];
		multip[1] = 1;
		result = polynomialMultiply(result, multip);
	}
	return result;
}

//TODO : Test!
DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag) {
	DArray y(1);

	DArray result;
	DArray multip;

	int j = 0;
	result = polynomialMultiply(y,omega(j, inpX));
	for (++j; j < inpX.size(); ++j) {
		y[0] = inpMDiag[j];
		multip = polynomialMultiply(y,omega(j, inpX));
		result = polynomialMultiply(result, multip);
	}
	return result;
}

void getInterpolationMatrix(DArray X, DMatrix Y, DArray &intpX, DMatrix &intpM) {
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

void getPointsTest(DArray &X, DMatrix &Y) {
	Y.resize(4);
	for (int i = 0; i < 4; ++i) {
		X.push_back(i);
		Y[i].push_back(i*i);
		Y[i].push_back(2*i);
		//Y[i].push_back(2);
	}
}

void polynomialTest() {
	DArray P, Q;
	getVectorStd(P, "P");
	getVectorStd(Q, "Q");

	logPolynomial(P, "P");
	logPolynomial(Q, "Q");
	
	DArray R;
	R = polynomialAddition(P, Q);
	logPolynomial(R, "Osszeg");
	R = polynomialMultiply(P, Q);
	logPolynomial(R, "Szorzat");
}

void getVectorStd(DArray &P, string poliName) {
	int n;
	cout << poliName <<"\n mekkora? (fok, hossz) n= "; cin >> n;
	P.resize(n);
	for (unsigned i = 0; i < P.size(); i++) {
	 	cout << i << " . elem/tag :"; cin >> P[i];
	};
}

void logPolynomial(DArray P, string poliName) {
	cout << poliName << endl;
	int forSize = P.size() - 1;
	for (unsigned i = 0; i < forSize; i++) {
		cout<< P[i] <<" x^"<<i<<" + ";
	};
	cout<< P[forSize] <<" x^"<< forSize << endl; 
}

void logVector(DArray P, string vectorName) {
	cout << vectorName << endl;
	for (unsigned i = 0; i < P.size(); i++) {
		cout<< P[i] <<" ";
	};
	cout<< endl; 
}

void logCalculate(int i, int j, DMatrix M, DArray x) {
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

void logResult(DArray x, DMatrix M) {
	cout << endl <<" Eredmény: "<< M.size() << endl;
	for (int i = 0; i < M.size(); i++) {
		cout<<x[i]<<" | ";
		for (int j = 0; j < M[i].size(); j++) {
			cout<<M[i][j]<<"\t";
		}; 
		cout<<"\n";
	};
}

void getPointsStd(DArray &x, DMatrix &M) {
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

void interpolateMatrix(DArray &x, DMatrix &M) {
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

DArray polynomialAddition(DArray P, DArray Q) { 
	bool nagyP = false;
	if (P.size() > Q.size()) { 
		nagyP = true;
	}

	DArray S (max(P.size(),Q.size()));
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
			S[i]=Q[i];
		}
	};
  return S;
};

DArray polynomialMultiply(DArray P, DArray Q) {
    DArray R((P.size()+Q.size())-1);
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
