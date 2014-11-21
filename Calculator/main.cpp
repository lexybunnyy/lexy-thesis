#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#define PI 3.14159265

using namespace std;

void interpolacio();
void fuggveny(double x);
void polinom();
double f(double x);
double g(double g);
vector<int> szorzas(vector<int> P, vector<int> Q);
vector<int> osszeg(vector<int> P, vector<int> Q);

int main()
{
	cout << "Interpolacio"<<endl;
	interpolacio();
	//fuggveny();
	//polinom ();
    return 0;
}

void calculateLog(int i, int j, vector<vector<double> > M, vector<double> x) {
	cout << i << j << " = ";
	cout << i-1 << j << " - " << i-1 << j-1 << " // " << j << j-i;
	cout << endl;
	cout << M[i-1][j] << " - " << M[i-1][j-1] << " / " << x[j] <<" - "<< x[j-i];
	cout << " = " <<  M[i-1][j]-M[i-1][j-1] << "/" << x[j]-x[j-i];
	cout << " = " <<  (M[i-1][j]-M[i-1][j-1])/(x[j]-x[j-i]);
	cout << endl;
}

void interpolacio()
{
	int n;
	vector<vector<double> > M;

	cout<<"Adja meg hany pontban vizsgaljuk!"<<endl; 
	cin>>n;
	vector<double> x(n+1);
	cout<<"Adja meg a pontokat!"<<endl;
	for (int i = 0; i < n; i++) { 
		cout<< i+1 << ". pont: "; cin >> x[i];
	};

	M.resize(n+1);
	for (int i = 0; i < n; i++) { 
		M[i].resize(n+1);
		for (int j = 0; j < n; j++) {
			M[i][j] = 0;
		}
	}

	for (int j = 0; j < n; j++) { 
		M[0][j]=g(x[j]);
	}
	
	cout << endl <<" Kalkulátor Logika: "<< endl;
	for (int i = 1; i < n; i++) {
		for(int j = i; j < n; j++){
			calculateLog(i, j, M, x);
			M[i][j] = (M[i-1][j]-M[i-1][j-1])/(x[j]-x[j-i]); 
		};
	}
	cout << endl <<" Eredmény: "<< endl;
	for (int i = 0; i < n; i++) {
		cout<<"\t";
		cout<<x[i]<<" | ";
		for (int j = 0; j < n; j++) {
			cout<<M[j][i]<<"\t";
		}; 
		cout<<endl;
	};
}

double g(double x){
	return x+1;
}

//-----------------------------------------------------------------------Polinomok es Muveletek
void polinom()
{
	int n;
	cout << "hanyadfoku a P polinom? n= "; cin>> n;
	vector<int> P(n+1),Q(2);

	cout<<"Add meg a P polinom ertekeit!"<<endl;
	for(unsigned i=0;i<(P.size());i++) {
		cout<< i<<" foku tag:"; cin>> P[i];
	};

	cout<<"Add meg a Q polinom ertekeit! (elsofoku)"<<endl;
	for(unsigned i=0;i<Q.size();i++) {
	 	cout<< i<<" foku tag:"; cin>> Q[i];
	};

	vector<int> R((P.size()+Q.size())-1);
	R = szorzas(P,Q);

	vector<int> S (max(P.size(),Q.size()));
	S = osszeg(P,Q);

	cout<< "A 2 Polinom szorzata: "<<endl;
	for(unsigned i=0;i<R.size();i++) {
		cout<< R[i] <<" x^"<<i<<"  "; 
	};
	cout<<endl <<"A 2 Polinom osszege: "<<endl;
	for(unsigned i=0;i<S.size();i++) {
		cout<< S[i] <<" x^"<<i<<"  "; 
	};
};
//-----------------------------------------------------------------------Polinomok es Muveletek

//------------------------------------------------------Polinom Oszzeg
vector<int> osszeg(vector<int> P, vector<int> Q) { 
	bool nagyP = false;
	if (P.size() > Q.size()) { 
		nagyP = true;
	}

	vector<int> S (max(P.size(),Q.size()));
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
//------------------------------------------------------Polinom Oszzeg Vege

//------------------------------------------------------Polinom Szorzat
vector<int> szorzas(vector<int> P, vector<int> Q)
{
    vector<int> R((P.size()+Q.size())-1);
    // Polinom nullazas 
    for(unsigned i=0;i<R.size();i++){R[i]=0;};
    	//Polinom feltoltes
    	for (unsigned i=0; i<P.size(); i++) { 
    		for (unsigned j=0;j<Q.size();j++) {  
    			R[i+j]+=P[i]*Q[j]; 
    	};
    };
    return R;
};
//------------------------------------------------------Polinom Szorzat Vege


//------------------------------------------------------Fuggvenyertek Visszaadas
void fuggveny() {
	double x;
	cout << "x= "; cin>> x;
    cout <<"f(x)=  "<< f(x) <<endl;
};

double f(double x) { 
	double sinx,y;
	sinx = sin (x*PI/180);
	y=(-1)*exp((x/2)*sinx);
	return y;
};
//-------------------------------------------------------Fuggvenyertek Visszaadas Vege
